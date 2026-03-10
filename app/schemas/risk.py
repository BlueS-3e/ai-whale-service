"""Risk assessment request/response schemas."""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime


class RiskAssessmentRequest(BaseModel):
    """Request schema for risk assessment."""
    coin_symbol: str = Field(..., description="Cryptocurrency symbol")
    chain: Optional[str] = Field(None, description="Blockchain: ethereum, bsc, polygon, etc.")
    contract_address: Optional[str] = Field(None, description="Token contract address")
    
    class Config:
        json_schema_extra = {
            "example": {
                "coin_symbol": "SHIB",
                "chain": "ethereum",
                "contract_address": "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
            }
        }


class RiskFactor(BaseModel):
    """Individual risk factor."""
    name: str
    score: int = Field(..., ge=0, le=100)
    severity: str = Field(..., description="low, medium, high, critical")
    description: str


class RiskAssessmentResponse(BaseModel):
    """Response schema for risk assessment."""
    coin_symbol: str
    overall_risk_score: int = Field(..., ge=0, le=100, description="0 = low risk, 100 = high risk")
    risk_level: str = Field(..., description="low, medium, high, critical")
    risk_factors: List[RiskFactor]
    
    # Detailed breakdown
    smart_contract_risk: int = Field(..., ge=0, le=100)
    liquidity_risk: int = Field(..., ge=0, le=100)
    volatility_risk: int = Field(..., ge=0, le=100)
    whale_concentration_risk: int = Field(..., ge=0, le=100)
    sentiment_risk: int = Field(..., ge=0, le=100)
    
    recommendations: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "coin_symbol": "SHIB",
                "overall_risk_score": 72,
                "risk_level": "high",
                "risk_factors": [
                    {
                        "name": "High Whale Concentration",
                        "score": 85,
                        "severity": "high",
                        "description": "Top 10 wallets hold 65% of supply"
                    }
                ],
                "smart_contract_risk": 45,
                "liquidity_risk": 60,
                "volatility_risk": 88,
                "whale_concentration_risk": 85,
                "sentiment_risk": 55,
                "recommendations": [
                    "Consider position sizing carefully",
                    "Set tight stop losses"
                ],
                "warnings": [
                    "Extremely high volatility detected",
                    "Whale concentration above safe threshold"
                ],
                "timestamp": "2024-01-15T12:00:00"
            }
        }


class PortfolioHolding(BaseModel):
    """Single holding in a portfolio."""
    coin_symbol: str
    amount: float
    current_value_usd: float
    allocation_percentage: float


class PortfolioRiskRequest(BaseModel):
    """Request schema for portfolio risk assessment."""
    holdings: List[PortfolioHolding] = Field(..., min_length=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "holdings": [
                    {"coin_symbol": "BTC", "amount": 0.5, "current_value_usd": 20000, "allocation_percentage": 50},
                    {"coin_symbol": "ETH", "amount": 5, "current_value_usd": 10000, "allocation_percentage": 25},
                    {"coin_symbol": "SOL", "amount": 100, "current_value_usd": 10000, "allocation_percentage": 25}
                ]
            }
        }


class PortfolioRiskResponse(BaseModel):
    """Response schema for portfolio risk assessment."""
    total_value_usd: float
    overall_risk_score: int = Field(..., ge=0, le=100)
    risk_level: str
    diversification_score: int = Field(..., ge=0, le=100, description="100 = well diversified")
    
    correlation_matrix: Dict[str, Dict[str, float]] = Field(..., description="Asset correlations")
    risk_by_holding: List[Dict] = Field(..., description="Individual holding risks")
    
    max_drawdown_estimate: float = Field(..., description="Estimated maximum drawdown %")
    value_at_risk_95: float = Field(..., description="95% VaR in USD")
    
    rebalancing_suggestions: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
