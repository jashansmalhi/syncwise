from __future__ import annotations

import re
from dataclasses import dataclass

from app.data.mock_songs import MOCK_SONGS
from app.models.schemas import RecommendationRequest, RecommendedSong


KEYWORD_BOOSTS: dict[str, list[str]] = {
    "Tech": ["ai", "app", "digital", "future", "platform", "innovation", "software"],
    "Retail": ["shop", "sale", "brand", "customer", "store", "fashion"],
    "Entertainment": ["show", "stream", "watch", "trailer", "episode", "event"],
    "F&B": ["food", "drink", "taste", "restaurant", "kitchen", "fresh"],
    "Automotive": ["car", "drive", "road", "speed", "engine", "performance"],
    "Finance": ["bank", "money", "invest", "secure", "trust", "wealth"],
    "Healthcare": ["health", "care", "clinic", "wellness", "patient", "medical"],
    "Other": ["community", "service", "story", "daily", "people"],
}


@dataclass
class ScoredSong:
    song: dict
    score: float
    reasons: list[str]


class RecommendationService:
    """Rule-based recommendation service. Replace this class with ML inference later."""

    def get_recommendations(self, request: RecommendationRequest, limit: int = 5) -> list[RecommendedSong]:
        scored = [self._score_song(song, request) for song in MOCK_SONGS]
        ranked = sorted(scored, key=lambda s: s.score, reverse=True)[:limit]

        return [
            RecommendedSong(
                id=item.song["id"],
                title=item.song["title"],
                artist=item.song["artist"],
                genre=item.song["genre"],
                energy=item.song["energy"],
                tempo=item.song["tempo"],
                mood=item.song["mood"],
                matchScore=min(100, max(55, round(item.score))),
                explanation=self._build_explanation(item.reasons),
                image=item.song.get("image"),
            )
            for item in ranked
        ]

    def _score_song(self, song: dict, request: RecommendationRequest) -> ScoredSong:
        score = 45.0
        reasons: list[str] = []

        if song["genre"] == request.genre.value:
            score += 20
            reasons.append("Genre aligns with the ad brief")

        if song["mood"] == request.mood.value:
            score += 15
            reasons.append("Mood is a strong fit")

        if song["tempo"] == request.tempo.value:
            score += 14
            reasons.append("Tempo matches the pacing")

        energy_gap = abs(song["energy"] - request.energy)
        score += max(0, 14 - (energy_gap * 4))
        if energy_gap <= 1:
            reasons.append("Energy level is close to target")

        if request.industry.value in song["industries"]:
            score += 10
            reasons.append("Historically performs in this industry")

        keyword_boost = self._keyword_boost(song, request)
        score += keyword_boost
        if keyword_boost >= 4:
            reasons.append("Ad description keywords reinforce the match")

        return ScoredSong(song=song, score=score, reasons=reasons)

    def _keyword_boost(self, song: dict, request: RecommendationRequest) -> float:
        tokens = set(re.findall(r"\b[a-zA-Z]+\b", request.adDescription.lower()))
        if not tokens:
            return 0

        score = 0.0
        for keyword in song.get("keywords", []):
            if keyword.lower() in tokens:
                score += 1.5

        for keyword in KEYWORD_BOOSTS.get(request.industry.value, []):
            if keyword in tokens:
                score += 1.0

        return min(score, 12.0)

    def _build_explanation(self, reasons: list[str]) -> str:
        if not reasons:
            return "Balanced profile across genre, mood, and tempo for broad campaign compatibility."

        top_reasons = reasons[:3]
        return "; ".join(top_reasons) + "."
