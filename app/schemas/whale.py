"""Whale-related request/response schemas."""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class WhalePredictionRequest(BaseModel):
    """Request schema for whale movement prediction."""
    wallet_address: str = Field(..., description="Blockchain wallet address")
    coin_symbol: str = Field(..., description="Cryptocurrency symbol (e.g., BTC, ETH)")
    timeframe: str = Field(default="24h", description="Prediction timeframe: 1h, 24h, 7d")

    class Config:
        json_schema_extra = {
            "example": {
                "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                "coin_symbol": "ETH",
                "timeframe": "24h"
            }
        }


class WhalePredictionResponse(BaseModel):
    """Response schema for whale movement prediction."""
    wallet_address: str
    coin_symbol: str
    movement_probability: float = Field(..., ge=0, le=1, description="Probability of movement (0-1)")
    confidence: float = Field(..., ge=0, le=1, description="Model confidence (0-1)")
    predicted_action: str = Field(..., description="buy, sell, or hold")
    estimated_amount: Optional[float] = Field(None, description="Estimated transaction amount")
    risk_level: str = Field(..., description="low, medium, high")
    factors: dict = Field(..., description="Key factors influencing prediction")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                "coin_symbol": "ETH",
                "movement_probability": 0.78,
                "confidence": 0.85,
                "predicted_action": "sell",
                "estimated_amount": 150.5,
                "risk_level": "medium",
                "factors": {
                    "recent_activity": "high",
                    "market_sentiment": "bearish",
                    "historical_pattern": "matches_previous_sell"
                },
                "timestamp": "2024-01-15T12:00:00"
            }
        }


class WhaleTransaction(BaseModel):
    """Single whale transaction."""
    tx_hash: str
    timestamp: datetime
    from_address: str
    to_address: str
    amount: float
    coin_symbol: str
    usd_value: Optional[float] = None


class WhaleHistoryRequest(BaseModel):
    """Request schema for whale transaction history."""
    wallet_address: str = Field(..., description="Wallet address to query")
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class WhaleHistoryResponse(BaseModel):
    """Response schema for whale transaction history."""
    wallet_address: str
    total_transactions: int
    transactions: List[WhaleTransaction]
    total_volume_usd: float
    most_traded_coin: str
    avg_transaction_size: float
