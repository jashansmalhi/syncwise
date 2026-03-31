import json
import re
from typing import Callable, Dict, List, Optional

import joblib
import numpy as np
import pandas as pd

from app.core.config import settings
from app.models.schemas import RecommendationRequest, RecommendedSong
from app.services.artifact_store import ArtifactStore

try:
    import anthropic
except ImportError:  # pragma: no cover
    anthropic = None


POPULARITY_PENALTY = 0.20
TEMPO_MIN = 0.0
TEMPO_MAX = 250.0

TEMPO_MAP = {"Slow": 0.25, "Medium": 0.50, "Fast": 0.75}
ENERGY_MAP = {1: 0.1, 2: 0.3, 3: 0.5, 4: 0.7, 5: 0.9}
MOOD_MAP = {"Positive": 0.8, "Neutral": 0.5, "Serious": 0.2}

GENRE_INDUSTRY_MAP = {
    "Electronic": ["Tech", "Entertainment"],
    "Chiptune": ["Tech", "Entertainment"],
    "Sound Art": ["Tech", "Entertainment"],
    "Rock": ["Automotive", "Entertainment"],
    "Punk": ["Entertainment", "Retail"],
    "Post-Punk": ["Entertainment", "Retail"],
    "Post-Rock": ["Automotive", "Entertainment"],
    "Metal": ["Automotive", "Entertainment"],
    "Psych-Rock": ["Entertainment", "Retail"],
    "Indie-Rock": ["Retail", "Entertainment", "F&B"],
    "Pop": ["Retail", "F&B", "Healthcare", "Entertainment"],
    "Hip-Hop": ["Retail", "Entertainment", "Automotive"],
    "Trip-Hop": ["Retail", "Finance", "Healthcare"],
    "Folk": ["F&B", "Healthcare", "Retail"],
    "Psych-Folk": ["F&B", "Entertainment", "Retail"],
    "Old-Time / Historic": ["F&B", "Finance", "Retail"],
    "Jazz": ["Finance", "F&B", "Healthcare"],
    "Blues": ["F&B", "Entertainment"],
    "Classical": ["Finance", "Healthcare", "F&B"],
    "Soundtrack": ["Automotive", "Entertainment", "Finance"],
    "International": ["F&B", "Entertainment", "Retail"],
    "Kid-Friendly": ["F&B", "Healthcare", "Retail"],
    "Compilation": ["Retail", "Entertainment"],
}


class RecommendationService:
    def __init__(
        self,
        artifact_store: Optional[ArtifactStore] = None,
        artifacts: Optional[Dict[str, object]] = None,
        llm_feature_resolver: Optional[Callable[[str], Dict[str, float]]] = None,
    ) -> None:
        self.artifact_store = artifact_store or ArtifactStore()
        self._artifacts = artifacts
        self.llm_feature_resolver = llm_feature_resolver
        self._anthropic_client = None

    @staticmethod
    def get_valid_genres(industry: str) -> List[str]:
        return [
            genre
            for genre, industries in GENRE_INDUSTRY_MAP.items()
            if industry in industries
        ]

    def get_recommendations(self, request: RecommendationRequest, limit: int = 5) -> List[RecommendedSong]:
        artifacts = self._get_artifacts()
        df_tracks = artifacts["df_tracks"]
        df_pca = artifacts["df_pca"]
        weights = artifacts["weights"]

        target_energy = ENERGY_MAP[request.energy]
        target_tempo = TEMPO_MAP[request.tempo.value]
        target_valence = MOOD_MAP[request.mood.value]
        llm_features = self._get_llm_features(request.adDescription)

        df_filtered = self._filter_tracks(
            df_tracks=df_tracks,
            industry=request.industry.value,
            lyrics_preference=request.lyricsPreference.value,
            genre_override=[genre.value for genre in request.genreOverride or []],
        )
        df_pca_filtered = df_pca.loc[df_filtered.index]

        scores = np.zeros(len(df_filtered))
        scores += weights["energy"] * (
            df_filtered["echonest_audio_features_energy"].values - target_energy
        ) ** 2
        scores += weights["tempo"] * (
            df_filtered["echonest_audio_features_tempo_norm"].values - target_tempo
        ) ** 2
        scores += weights["valence"] * (
            df_filtered["echonest_audio_features_valence"].values - target_valence
        ) ** 2
        scores += weights["danceability"] * (
            df_filtered["echonest_audio_features_danceability"].values - llm_features["danceability"]
        ) ** 2
        scores += weights["acousticness"] * (
            df_filtered["echonest_audio_features_acousticness"].values - llm_features["acousticness"]
        ) ** 2

        pca_centroid = df_pca_filtered.mean().values
        pca_distances = np.sum((df_pca_filtered.values - pca_centroid) ** 2, axis=1)
        if len(pca_distances) and float(pca_distances.max()) > 0:
            pca_distances = pca_distances / float(pca_distances.max())
        else:
            pca_distances = np.zeros(len(df_filtered))
        scores += weights["pca"] * pca_distances
        scores = np.sqrt(scores)

        high_mask = df_filtered["popularity_bucket"].values == "High"
        scores[high_mask] *= 1 + POPULARITY_PENALTY

        ranked = df_filtered.copy()
        ranked["match_score"] = scores
        top_matches = ranked.nsmallest(limit, "match_score")

        return [
            RecommendedSong(
                artist=row["artist_name"],
                title=row["track_title"],
                genre=row["track_genres_name"],
                fmaUrl=row["fma_album_url"],
                matchScore=round(float(row["match_score"]), 4),
                popularity=row["popularity_bucket"],
            )
            for _, row in top_matches.iterrows()
        ]

    def _get_artifacts(self) -> Dict[str, object]:
        if self._artifacts is None:
            self._artifacts = self._load_artifacts()
        return self._artifacts

    def _load_artifacts(self) -> Dict[str, object]:
        paths = self.artifact_store.resolve_required_paths()
        scaler = joblib.load(paths["scaler"])
        pca = joblib.load(paths["pca"])
        weights = json.loads(paths["weights"].read_text())
        df_tracks = pd.read_csv(paths["tracks"], low_memory=False)
        df_tracks["echonest_audio_features_tempo_norm"] = (
            (df_tracks["echonest_audio_features_tempo"] - TEMPO_MIN)
            / (TEMPO_MAX - TEMPO_MIN)
        )

        librosa_cols = [
            column
            for column in df_tracks.columns
            if column.startswith(("mfcc", "chroma", "spectral", "tonnetz", "zcr"))
        ]
        df_librosa_scaled = scaler.transform(df_tracks[librosa_cols])
        df_pca = pd.DataFrame(
            pca.transform(df_librosa_scaled),
            index=df_tracks.index,
            columns=[f"pca_{index + 1:03d}" for index in range(pca.n_components_)],
        )
        return {"df_tracks": df_tracks, "df_pca": df_pca, "weights": weights}

    def _get_llm_features(self, description: str) -> Dict[str, float]:
        if self.llm_feature_resolver is not None:
            features = self.llm_feature_resolver(description)
            return self._normalize_llm_features(features)

        if not settings.anthropic_api_key or anthropic is None:
            return self._default_llm_features()

        if self._anthropic_client is None:
            self._anthropic_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

        try:
            message = self._anthropic_client.messages.create(
                model="claude-3-5-sonnet-latest",
                max_tokens=256,
                messages=[
                    {
                        "role": "user",
                        "content": (
                            "You are a music supervisor choosing background music for an advertisement. "
                            "Given this ad description, estimate danceability and acousticness for the ideal "
                            "background music. Return only JSON with float values between 0 and 1.\n\n"
                            f"Ad description: {description}"
                        ),
                    }
                ],
            )
            text = message.content[0].text.strip()
            match = re.search(r"\{.*?\}", text, re.DOTALL)
            if match:
                return self._normalize_llm_features(json.loads(match.group()))
        except Exception:
            return self._default_llm_features()

        return self._default_llm_features()

    def _filter_tracks(
        self,
        *,
        df_tracks: pd.DataFrame,
        industry: str,
        lyrics_preference: str,
        genre_override: Optional[List[str]] = None,
    ) -> pd.DataFrame:
        valid_genres = genre_override or self.get_valid_genres(industry)
        if valid_genres:
            df_filtered = df_tracks[df_tracks["track_genres_name"].isin(valid_genres)].copy()
        else:
            df_filtered = df_tracks.copy()

        if len(df_filtered) < 10:
            df_filtered = df_tracks.copy()

        if lyrics_preference == "No Lyrics":
            no_lyrics = df_filtered[
                df_filtered["echonest_audio_features_instrumentalness"] > 0.8
            ].copy()
            if len(no_lyrics) >= 10:
                df_filtered = no_lyrics

        return df_filtered

    def _default_llm_features(self) -> Dict[str, float]:
        return {"danceability": 0.5, "acousticness": 0.5}

    def _normalize_llm_features(self, features: Dict[str, float]) -> Dict[str, float]:
        danceability = float(features.get("danceability", 0.5))
        acousticness = float(features.get("acousticness", 0.5))
        return {
            "danceability": max(0.0, min(1.0, danceability)),
            "acousticness": max(0.0, min(1.0, acousticness)),
        }
