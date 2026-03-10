"""Tests for services."""
import pytest
from app.services.whale_service import WhaleService
from app.services.sentiment_service import SentimentService
from app.services.risk_service import RiskService
from app.models.whale_predictor import WhalePredictor
from app.models.sentiment_analyzer import SentimentAnalyzer
from app.models.risk_scorer import RiskScorer
from app.core.config import settings


class TestWhaleService:
    """Tests for WhaleService."""
    
    @pytest.fixture
    def whale_service(self):
        """Create whale service instance."""
        model = WhalePredictor(settings.MODEL_PATH)
        return WhaleService(model)
    
    @pytest.mark.asyncio
    async def test_predict(self, whale_service):
        """Test whale prediction."""
        result = await whale_service.predict(
            "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            "ETH"
        )
        
        assert result is not None
        assert "movement_probability" in result
        assert "confidence" in result
        assert "predicted_action" in result


class TestSentimentService:
    """Tests for SentimentService."""
    
    @pytest.fixture
    def sentiment_service(self):
        """Create sentiment service instance."""
        model = SentimentAnalyzer(settings.MODEL_PATH)
        return SentimentService(model)
    
    @pytest.mark.asyncio
    async def test_analyze(self, sentiment_service):
        """Test sentiment analysis."""
        result = await sentiment_service.analyze(
            "Bitcoin is looking very bullish!",
            "BTC"
        )
        
        assert result is not None
        assert "sentiment_score" in result
        assert "sentiment_label" in result
        assert -1 <= result["sentiment_score"] <= 1


class TestRiskService:
    """Tests for RiskService."""
    
    @pytest.fixture
    def risk_service(self):
        """Create risk service instance."""
        model = RiskScorer(settings.MODEL_PATH)
        return RiskService(model)
    
    @pytest.mark.asyncio
    async def test_assess(self, risk_service):
        """Test risk assessment."""
        result = await risk_service.assess("BTC")
        
        assert result is not None
        assert "overall_risk_score" in result
        assert "risk_level" in result
        assert 0 <= result["overall_risk_score"] <= 100
