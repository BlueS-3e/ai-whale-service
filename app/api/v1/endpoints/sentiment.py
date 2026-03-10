"""Sentiment analysis API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.sentiment import (
    SentimentAnalysisRequest,
    SentimentAnalysisResponse,
    SentimentTrendRequest,
    SentimentTrendResponse
)
from app.services.sentiment_service import SentimentService
from app.api.v1.deps import get_sentiment_service
from app.core.security import api_key_auth
from app.core.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/sentiment")


@router.post("/analyze", response_model=SentimentAnalysisResponse)
async def analyze_sentiment(
    request: SentimentAnalysisRequest,
    service: SentimentService = Depends(get_sentiment_service),
    _: str = Depends(api_key_auth)
):
    """
    Analyze sentiment of text (tweet, article, comment).
    
    Returns:
    - Sentiment score (-1 to 1: negative to positive)
    - Confidence level
    - Key phrases and entities
    """
    try:
        logger.info(f"Sentiment analysis request for: {request.coin_symbol}")
        result = await service.analyze(request.text, request.coin_symbol)
        
        return result
    
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.post("/trend", response_model=SentimentTrendResponse)
async def get_sentiment_trend(
    request: SentimentTrendRequest,
    service: SentimentService = Depends(get_sentiment_service),
    _: str = Depends(api_key_auth)
):
    """
    Get sentiment trend for a coin over time period.
    
    Aggregates social media sentiment from:
    - Twitter
    - Reddit
    - News articles
    - Telegram (if enabled)
    
    Returns time-series sentiment data.
    """
    try:
        logger.info(f"Sentiment trend request: {request.coin_symbol} - {request.time_period}")
        trend = await service.get_trend(
            request.coin_symbol,
            request.time_period,
            request.sources
        )
        
        return trend
    
    except Exception as e:
        logger.error(f"Sentiment trend error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch trend: {str(e)}"
        )


@router.get("/coins/{coin_symbol}/sentiment")
async def get_coin_sentiment(
    coin_symbol: str,
    service: SentimentService = Depends(get_sentiment_service),
    _: str = Depends(api_key_auth)
):
    """
    Get current aggregated sentiment score for a coin.
    
    Returns real-time sentiment snapshot.
    """
    try:
        sentiment = await service.get_current_sentiment(coin_symbol)
        
        if not sentiment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No sentiment data available for {coin_symbol}"
            )
        
        return sentiment
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Coin sentiment error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sentiment: {str(e)}"
        )
