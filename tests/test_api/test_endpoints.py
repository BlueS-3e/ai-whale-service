"""Tests for API endpoints."""
import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Tests for health check endpoint."""
    
    def test_health_check(self, client: TestClient):
        """Test basic health check."""
        response = client.get("/v1/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
    
    def test_readiness_check(self, client: TestClient):
        """Test readiness check."""
        response = client.get("/v1/health/ready")
        
        assert response.status_code == 200
        data = response.json()
        assert "ready" in data
        assert "checks" in data


class TestWhaleEndpoints:
    """Tests for whale prediction endpoints."""
    
    def test_whale_prediction_without_auth(self, client: TestClient, mock_whale_data):
        """Test whale prediction without API key."""
        response = client.post("/v1/whale/predict", json=mock_whale_data)
        
        assert response.status_code == 401
    
    def test_whale_prediction_with_auth(
        self,
        client: TestClient,
        api_headers: dict,
        mock_whale_data
    ):
        """Test whale prediction with valid API key."""
        response = client.post(
            "/v1/whale/predict",
            json=mock_whale_data,
            headers=api_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "movement_probability" in data
        assert "confidence" in data
        assert "predicted_action" in data
        assert 0 <= data["movement_probability"] <= 1
    
    def test_whale_history(
        self,
        client: TestClient,
        api_headers: dict
    ):
        """Test whale transaction history."""
        request_data = {
            "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            "limit": 10
        }
        
        response = client.post(
            "/v1/whale/history",
            json=request_data,
            headers=api_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "wallet_address" in data
        assert "transactions" in data


class TestSentimentEndpoints:
    """Tests for sentiment analysis endpoints."""
    
    def test_sentiment_analysis(
        self,
        client: TestClient,
        api_headers: dict,
        mock_sentiment_data
    ):
        """Test sentiment analysis."""
        response = client.post(
            "/v1/sentiment/analyze",
            json=mock_sentiment_data,
            headers=api_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "sentiment_score" in data
        assert "sentiment_label" in data
        assert "confidence" in data
        assert -1 <= data["sentiment_score"] <= 1
    
    def test_sentiment_trend(
        self,
        client: TestClient,
        api_headers: dict
    ):
        """Test sentiment trend."""
        request_data = {
            "coin_symbol": "BTC",
            "time_period": "7d",
            "sources": ["twitter", "reddit"]
        }
        
        response = client.post(
            "/v1/sentiment/trend",
            json=request_data,
            headers=api_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "overall_sentiment" in data
        assert "trend" in data
        assert "data_points" in data


class TestRiskEndpoints:
    """Tests for risk assessment endpoints."""
    
    def test_risk_assessment(
        self,
        client: TestClient,
        api_headers: dict,
        mock_risk_data
    ):
        """Test risk assessment."""
        response = client.post(
            "/v1/risk/assess",
            json=mock_risk_data,
            headers=api_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "overall_risk_score" in data
        assert "risk_level" in data
        assert "risk_factors" in data
        assert 0 <= data["overall_risk_score"] <= 100
    
    @pytest.mark.skip(reason="Portfolio endpoint not fully implemented yet")
    def test_portfolio_risk(
        self,
        client: TestClient,
        api_headers: dict
    ):
        """Test portfolio risk assessment."""
        request_data = {
            "holdings": [
                {
                    "coin_symbol": "BTC",
                    "amount": 0.5,
                    "current_value_usd": 20000,
                    "allocation_percentage": 50
                },
                {
                    "coin_symbol": "ETH",
                    "amount": 5,
                    "current_value_usd": 10000,
                    "allocation_percentage": 50
                }
            ]
        }
        
        response = client.post(
            "/v1/risk/portfolio",
            json=request_data,
            headers=api_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "overall_risk_score" in data
        assert "diversification_score" in data
        assert "risk_by_holding" in data
