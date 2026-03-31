from fastapi import APIRouter
from typing import Dict

from app.models.schemas import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter()
recommendation_service = RecommendationService()


@router.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@router.post("/recommendations", response_model=RecommendationResponse)
def recommendations(payload: RecommendationRequest) -> RecommendationResponse:
    return recommendation_service.get_recommendations(payload, limit=payload.limit)
