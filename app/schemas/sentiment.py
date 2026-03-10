"""Sentiment analysis request/response schemas."""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime


class SentimentAnalysisRequest(BaseModel):
    """Request schema for text sentiment analysis."""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to analyze")
    coin_symbol: Optional[str] = Field(None, description="Related cryptocurrency symbol")
    source: Optional[str] = Field(None, description="Source: twitter, reddit, news, telegram")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Bitcoin is showing strong bullish momentum! 🚀",
                "coin_symbol": "BTC",
                "source": "twitter"
            }
        }


class SentimentAnalysisResponse(BaseModel):
    """Response schema for sentiment analysis."""
    text: str
    coin_symbol: Optional[str]
    sentiment_score: float = Field(..., ge=-1, le=1, description="Sentiment score: -1 (negative) to 1 (positive)")
    sentiment_label: str = Field(..., description="bullish, bearish, or neutral")
    confidence: float = Field(..., ge=0, le=1)
    key_phrases: List[str] = Field(default_factory=list)
    entities: List[str] = Field(default_factory=list)
    topics: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Bitcoin is showing strong bullish momentum! 🚀",
                "coin_symbol": "BTC",
                "sentiment_score": 0.92,
                "sentiment_label": "bullish",
                "confidence": 0.88,
                "key_phrases": ["strong bullish momentum"],
                "entities": ["Bitcoin"],
                "topics": ["price_movement", "bullish"],
                "timestamp": "2024-01-15T12:00:00"
            }
        }


class SentimentTrendRequest(BaseModel):
    """Request schema for sentiment trend over time."""
    coin_symbol: str = Field(..., description="Cryptocurrency symbol")
    time_period: str = Field(default="7d", description="Time period: 1h, 24h, 7d, 30d")
    sources: Optional[List[str]] = Field(
        default=None,
        description="Sources to include: twitter, reddit, news, telegram"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "coin_symbol": "ETH",
                "time_period": "7d",
                "sources": ["twitter", "reddit"]
            }
        }


class SentimentDataPoint(BaseModel):
    """Single sentiment data point in time series."""
    timestamp: datetime
    sentiment_score: float
    volume: int = Field(..., description="Number of mentions")
    source: str


class SentimentTrendResponse(BaseModel):
    """Response schema for sentiment trend."""
    coin_symbol: str
    time_period: str
    overall_sentiment: float = Field(..., ge=-1, le=1)
    trend: str = Field(..., description="improving, declining, or stable")
    data_points: List[SentimentDataPoint]
    total_mentions: int
    source_breakdown: Dict[str, float] = Field(..., description="Sentiment by source")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
