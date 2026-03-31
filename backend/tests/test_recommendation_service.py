from pathlib import Path

import pandas as pd
import pytest

from app.core.config import settings
from app.services.recommendation_service import RecommendationService
from app.models.schemas import RecommendationRequest


def test_get_valid_genres_returns_expected_v4_matches() -> None:
    genres = RecommendationService.get_valid_genres("Tech")

    assert "Electronic" in genres
    assert "Chiptune" in genres
    assert "Rock" not in genres


def test_get_recommendations_uses_override_and_no_lyrics_filter() -> None:
    df_tracks = pd.DataFrame(
        [
            {
                "artist_name": f"Artist {index}",
                "track_title": f"Track {index}",
                "track_genres_name": "Electronic" if index < 10 else "Rock",
                "fma_album_url": f"https://example.com/{index}",
                "popularity_bucket": "Low" if index < 9 else "High",
                "echonest_audio_features_energy": 0.7,
                "echonest_audio_features_tempo_norm": 0.5,
                "echonest_audio_features_valence": 0.8,
                "echonest_audio_features_danceability": 0.4,
                "echonest_audio_features_acousticness": 0.3,
                "echonest_audio_features_instrumentalness": 0.95 if index < 10 else 0.1,
            }
            for index in range(12)
        ]
    )
    df_pca = pd.DataFrame(
        [{"pca_001": float(index), "pca_002": float(index) / 2} for index in range(12)],
        index=df_tracks.index,
    )
    service = RecommendationService(
        artifacts={
            "df_tracks": df_tracks,
            "df_pca": df_pca,
            "weights": {
                "energy": 1.0,
                "tempo": 1.0,
                "valence": 1.0,
                "danceability": 1.0,
                "acousticness": 1.0,
                "pca": 0.1,
            },
        },
        llm_feature_resolver=lambda description: {
            "danceability": 0.4,
            "acousticness": 0.3,
        },
    )
    request = RecommendationRequest(
        adDescription="AI product launch for a tech company.",
        energy=4,
        tempo="Medium",
        mood="Positive",
        industry="Tech",
        genreOverride=["Electronic"],
        lyricsPreference="No Lyrics",
        limit=3,
    )

    recommendations = service.get_recommendations(request, limit=3)

    assert len(recommendations.recommendations) == 3
    assert recommendations.llmFallbackUsed is False
    assert all(result.genre == "Electronic" for result in recommendations.recommendations)
    assert all(result.fmaUrl.startswith("https://example.com/") for result in recommendations.recommendations)


def test_get_recommendations_without_genre_override_does_not_force_industry_genres() -> None:
    df_tracks = pd.DataFrame(
        [
            {
                "artist_name": "Artist Electronic",
                "track_title": "Track Electronic",
                "track_genres_name": "Electronic",
                "fma_album_url": "https://example.com/electronic",
                "popularity_bucket": "Low",
                "echonest_audio_features_energy": 0.7,
                "echonest_audio_features_tempo_norm": 0.5,
                "echonest_audio_features_valence": 0.8,
                "echonest_audio_features_danceability": 0.4,
                "echonest_audio_features_acousticness": 0.3,
                "echonest_audio_features_instrumentalness": 0.95,
            },
            {
                "artist_name": "Artist Jazz",
                "track_title": "Track Jazz",
                "track_genres_name": "Jazz",
                "fma_album_url": "https://example.com/jazz",
                "popularity_bucket": "Low",
                "echonest_audio_features_energy": 0.7,
                "echonest_audio_features_tempo_norm": 0.5,
                "echonest_audio_features_valence": 0.8,
                "echonest_audio_features_danceability": 0.4,
                "echonest_audio_features_acousticness": 0.3,
                "echonest_audio_features_instrumentalness": 0.95,
            },
        ]
    )
    df_pca = pd.DataFrame(
        [{"pca_001": float(index), "pca_002": float(index) / 2} for index in range(2)],
        index=df_tracks.index,
    )
    service = RecommendationService(
        artifacts={
            "df_tracks": df_tracks,
            "df_pca": df_pca,
            "weights": {
                "energy": 1.0,
                "tempo": 1.0,
                "valence": 1.0,
                "danceability": 1.0,
                "acousticness": 1.0,
                "pca": 0.1,
            },
        },
        llm_feature_resolver=lambda description: {
            "danceability": 0.4,
            "acousticness": 0.3,
        },
    )
    request = RecommendationRequest(
        adDescription="AI product launch for a tech company.",
        energy=4,
        tempo="Medium",
        mood="Positive",
        industry="Tech",
        lyricsPreference="No Lyrics",
        limit=2,
    )

    recommendations = service.get_recommendations(request, limit=2)

    assert {result.genre for result in recommendations.recommendations} == {"Electronic", "Jazz"}


@pytest.mark.skipif(
    not settings.ollama_api_key,
    reason="OLLAMA_API_KEY is not configured for live Ollama integration testing.",
)
def test_get_llm_features_uses_live_ollama_cloud() -> None:
    service = RecommendationService()

    result, fallback_used = service._get_llm_features("A polished AI dashboard commercial for a tech audience.")

    assert fallback_used is False
    assert 0.0 <= result["danceability"] <= 1.0
    assert 0.0 <= result["acousticness"] <= 1.0

def test_get_llm_features_falls_back_to_neutral_defaults_without_key(monkeypatch) -> None:
    service = RecommendationService()
    monkeypatch.setattr(settings, "ollama_api_key", "")

    result, fallback_used = service._get_llm_features("A polished AI dashboard commercial.")

    assert fallback_used is True
    assert result == {"danceability": 0.5, "acousticness": 0.5}
