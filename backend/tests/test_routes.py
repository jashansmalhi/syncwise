from fastapi.testclient import TestClient

from app.main import app
from app.models.schemas import RecommendedSong
from app.api import routes


client = TestClient(app)


def test_health_returns_ok() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_recommendations_returns_ranked_results() -> None:
    payload = {
        "adDescription": "An AI productivity campaign for a tech brand.",
        "energy": 4,
        "tempo": "Medium",
        "mood": "Positive",
        "industry": "Tech",
        "genreOverride": ["Electronic"],
        "lyricsPreference": "No Preference",
        "limit": 3,
    }

    routes.recommendation_service = _StubRecommendationService()
    response = client.post("/recommendations", json=payload)
    body = response.json()

    assert response.status_code == 200
    assert len(body["recommendations"]) == 3
    assert body["recommendations"][0]["fmaUrl"].startswith("https://")
    assert body["recommendations"][0]["popularity"] in {"Low", "Medium", "High"}


def test_recommendations_rejects_invalid_payload() -> None:
    payload = {
        "adDescription": "bad",
        "tempo": "Medium",
        "mood": "Positive",
        "industry": "Tech",
        "genreOverride": ["Electronic"],
    }

    response = client.post("/recommendations", json=payload)

    assert response.status_code == 422


class _StubRecommendationService:
    def get_recommendations(self, payload, limit: int = 5):
        return [
            RecommendedSong(
                artist=f"Artist {index}",
                title=f"Track {index}",
                genre="Electronic",
                fmaUrl=f"https://example.com/{index}",
                matchScore=round(0.1 + (index * 0.01), 4),
                popularity="Low",
            )
            for index in range(limit)
        ]
