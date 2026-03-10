"""Common dependencies for API endpoints."""
from app.services.whale_service import WhaleService
from app.services.sentiment_service import SentimentService
from app.services.risk_service import RiskService
from app.models.whale_predictor import WhalePredictor
from app.models.sentiment_analyzer import SentimentAnalyzer
from app.models.risk_scorer import RiskScorer
from app.core.config import settings


# Service singletons (in production, consider proper dependency injection)
_whale_service = None
_sentiment_service = None
_risk_service = None


def get_whale_service() -> WhaleService:
    """Get or create WhaleService instance."""
    global _whale_service
    if _whale_service is None:
        model = WhalePredictor(settings.MODEL_PATH)
        _whale_service = WhaleService(model)
    return _whale_service


def get_sentiment_service() -> SentimentService:
    """Get or create SentimentService instance."""
    global _sentiment_service
    if _sentiment_service is None:
        model = SentimentAnalyzer(settings.MODEL_PATH)
        _sentiment_service = SentimentService(model)
    return _sentiment_service


def get_risk_service() -> RiskService:
    """Get or create RiskService instance."""
    global _risk_service
    if _risk_service is None:
        model = RiskScorer(settings.MODEL_PATH)
        _risk_service = RiskService(model)
    return _risk_service
