from fastapi.testclient import TestClient

from app.main import app


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
        "genre": "Electronic",
        "limit": 3,
    }

    response = client.post("/recommendations", json=payload)
    body = response.json()

    assert response.status_code == 200
    assert len(body["recommendations"]) == 3
    assert body["recommendations"][0]["matchScore"] >= body["recommendations"][1]["matchScore"]


def test_recommendations_rejects_invalid_payload() -> None:
    payload = {
        "adDescription": "bad",
        "tempo": "Medium",
        "mood": "Positive",
        "industry": "Tech",
        "genre": "Electronic",
    }

    response = client.post("/recommendations", json=payload)

    assert response.status_code == 422
