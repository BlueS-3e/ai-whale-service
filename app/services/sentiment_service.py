"""Sentiment service - business logic for sentiment analysis."""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from app.models.sentiment_analyzer import SentimentAnalyzer
from app.services.social import SocialMediaService
from app.core.logger import get_logger

logger = get_logger(__name__)


class SentimentService:
    """
    Service layer for sentiment analysis.
    
    Orchestrates:
    - Social media data collection
    - Text preprocessing
    - Sentiment analysis
    - Trend aggregation
    """
    
    def __init__(self, model: SentimentAnalyzer):
        """Initialize sentiment service."""
        self.model = model
        self.social_service = SocialMediaService()
    
    async def analyze(self, text: str, coin_symbol: Optional[str] = None) -> Dict:
        """
        Analyze sentiment of a single text.
        
        Args:
            text: Text to analyze
            coin_symbol: Related cryptocurrency symbol
        
        Returns:
            Sentiment analysis results
        """
        try:
            logger.info(f"Analyzing sentiment for: {coin_symbol}")
            
            # Run sentiment analysis
            result = self.model.predict(text, coin_symbol)
            
            # Add metadata
            result["text"] = text
            result["coin_symbol"] = coin_symbol
            
            return result
            
        except Exception as e:
            logger.error(f"Sentiment analysis failed: {e}")
            raise
    
    async def get_trend(
        self,
        coin_symbol: str,
        time_period: str = "7d",
        sources: Optional[List[str]] = None
    ) -> Dict:
        """
        Get sentiment trend over time period.
        
        Args:
            coin_symbol: Cryptocurrency symbol
            time_period: Time period (1h, 24h, 7d, 30d)
            sources: List of sources to include
        
        Returns:
            Sentiment trend data
        """
        try:
            logger.info(f"Fetching sentiment trend: {coin_symbol} - {time_period}")
            
            # Parse time period
            hours = self._parse_time_period(time_period)
            start_time = datetime.utcnow() - timedelta(hours=hours)
            
            # Fetch social media data
            sources = sources or ["twitter", "reddit"]
            posts = await self.social_service.fetch_posts(
                coin_symbol,
                sources,
                start_time
            )
            
            if not posts:
                logger.warning(f"No social data found for {coin_symbol}")
                return self._empty_trend_response(coin_symbol, time_period)
            
            # Analyze each post
            data_points = []
            for post in posts:
                sentiment = self.model.predict(post["text"], coin_symbol)
                data_points.append({
                    "timestamp": post["timestamp"],
                    "sentiment_score": sentiment["sentiment_score"],
                    "volume": 1,
                    "source": post["source"]
                })
            
            # Aggregate data
            overall_sentiment = sum(p["sentiment_score"] for p in data_points) / len(data_points)
            
            # Calculate trend
            trend = self._calculate_trend(data_points)
            
            # Source breakdown
            source_breakdown = self._calculate_source_breakdown(data_points)
            
            return {
                "coin_symbol": coin_symbol,
                "time_period": time_period,
                "overall_sentiment": overall_sentiment,
                "trend": trend,
                "data_points": data_points[-100:],  # Last 100 points
                "total_mentions": len(posts),
                "source_breakdown": source_breakdown
            }
            
        except Exception as e:
            logger.error(f"Failed to get sentiment trend: {e}")
            raise
    
    async def get_current_sentiment(self, coin_symbol: str) -> Optional[Dict]:
        """
        Get current aggregated sentiment for a coin.
        
        Args:
            coin_symbol: Cryptocurrency symbol
        
        Returns:
            Current sentiment snapshot
        """
        try:
            # Get recent trend (last hour)
            trend = await self.get_trend(coin_symbol, "1h")
            
            if trend["total_mentions"] == 0:
                return None
            
            return {
                "coin_symbol": coin_symbol,
                "sentiment_score": trend["overall_sentiment"],
                "sentiment_label": self._score_to_label(trend["overall_sentiment"]),
                "total_mentions": trend["total_mentions"],
                "trend": trend["trend"],
                "timestamp": datetime.utcnow()
            }
            
        except Exception as e:
            logger.error(f"Failed to get current sentiment: {e}")
            raise
    
    def _parse_time_period(self, period: str) -> int:
        """Parse time period string to hours."""
        mapping = {
            "1h": 1,
            "24h": 24,
            "7d": 168,
            "30d": 720
        }
        return mapping.get(period, 168)  # Default to 7 days
    
    def _calculate_trend(self, data_points: List[Dict]) -> str:
        """Calculate sentiment trend direction."""
        if len(data_points) < 2:
            return "stable"
        
        # Compare first half to second half
        mid_point = len(data_points) // 2
        first_half_avg = sum(p["sentiment_score"] for p in data_points[:mid_point]) / mid_point
        second_half_avg = sum(p["sentiment_score"] for p in data_points[mid_point:]) / (len(data_points) - mid_point)
        
        diff = second_half_avg - first_half_avg
        
        if diff > 0.1:
            return "improving"
        elif diff < -0.1:
            return "declining"
        else:
            return "stable"
    
    def _calculate_source_breakdown(self, data_points: List[Dict]) -> Dict[str, float]:
        """Calculate average sentiment by source."""
        source_sentiments = {}
        source_counts = {}
        
        for point in data_points:
            source = point["source"]
            sentiment = point["sentiment_score"]
            
            if source not in source_sentiments:
                source_sentiments[source] = 0
                source_counts[source] = 0
            
            source_sentiments[source] += sentiment
            source_counts[source] += 1
        
        # Calculate averages
        breakdown = {}
        for source in source_sentiments:
            breakdown[source] = source_sentiments[source] / source_counts[source]
        
        return breakdown
    
    def _empty_trend_response(self, coin_symbol: str, time_period: str) -> Dict:
        """Return empty trend response when no data available."""
        return {
            "coin_symbol": coin_symbol,
            "time_period": time_period,
            "overall_sentiment": 0.0,
            "trend": "stable",
            "data_points": [],
            "total_mentions": 0,
            "source_breakdown": {}
        }
    
    def _score_to_label(self, score: float) -> str:
        """Convert sentiment score to label."""
        if score > 0.3:
            return "bullish"
        elif score < -0.3:
            return "bearish"
        else:
            return "neutral"
