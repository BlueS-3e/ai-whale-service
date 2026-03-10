"""Whale service - business logic for whale predictions."""
from typing import Optional, List, Dict
from app.models.whale_predictor import WhalePredictor
from app.services.blockchain import BlockchainService
from app.core.logger import get_logger

logger = get_logger(__name__)


class WhaleService:
    """
    Service layer for whale movement prediction.

    Orchestrates:
    - On-chain data fetching
    - Feature engineering
    - Model prediction
    - Result formatting
    """

    def __init__(self, model: WhalePredictor):
        """Initialize whale service."""
        self.model = model
        self.blockchain_service = BlockchainService()

    async def predict(self, wallet_address: str, coin_symbol: str) -> Optional[Dict]:
        """
        Predict whale movement for a wallet.

        Args:
            wallet_address: Wallet address to analyze
            coin_symbol: Cryptocurrency symbol

        Returns:
            Prediction results or None if insufficient data
        """
        try:
            logger.info(f"Predicting whale movement: {wallet_address} - {coin_symbol}")

            # Fetch on-chain data
            wallet_data = await self.blockchain_service.get_wallet_data(wallet_address)
            if not wallet_data:
                logger.warning(f"No wallet data found for {wallet_address}")
                return None

            # Build features for prediction
            features = self._build_features(wallet_data, coin_symbol)

            # Get prediction from model
            prediction = self.model.predict(features)

            # Enrich prediction with additional data
            result = {
                "wallet_address": wallet_address,
                "coin_symbol": coin_symbol,
                "movement_probability": prediction["probability"],
                "confidence": prediction["confidence"],
                "predicted_action": prediction["action"],
                "estimated_amount": self._estimate_amount(wallet_data, prediction),
                "risk_level": prediction["risk"],
                "factors": self._explain_factors(features, prediction)
            }

            return result

        except Exception as e:
            logger.error(f"Whale prediction error: {e}")
            raise

    async def get_history(
        self,
        wallet_address: str,
        limit: int = 20,
        offset: int = 0
    ) -> Dict:
        """
        Get whale transaction history.

        Args:
            wallet_address: Wallet address
            limit: Number of transactions to return
            offset: Number of transactions to skip

        Returns:
            Transaction history data
        """
        try:
            transactions = await self.blockchain_service.get_transactions(
                wallet_address,
                limit,
                offset
            )

            # Calculate statistics
            total_volume = sum(tx.get("usd_value", 0) for tx in transactions)
            coin_counts = {}
            for tx in transactions:
                coin = tx.get("coin_symbol")
                coin_counts[coin] = coin_counts.get(coin, 0) + 1

            most_traded = max(coin_counts.items(), key=lambda x: x[1])[0] if coin_counts else "N/A"

            return {
                "wallet_address": wallet_address,
                "total_transactions": len(transactions),
                "transactions": transactions,
                "total_volume_usd": total_volume,
                "most_traded_coin": most_traded,
                "avg_transaction_size": total_volume / len(transactions) if transactions else 0
            }

        except Exception as e:
            logger.error(f"Failed to fetch whale history: {e}")
            raise

    async def get_top_whales(self, coin_symbol: str, limit: int = 10) -> List[Dict]:
        """
        Get top whale wallets for a coin.

        Args:
            coin_symbol: Cryptocurrency symbol
            limit: Number of whales to return

        Returns:
            List of top whale wallets
        """
        try:
            whales = await self.blockchain_service.get_top_holders(coin_symbol, limit)
            return whales

        except Exception as e:
            logger.error(f"Failed to fetch top whales: {e}")
            raise

    def _build_features(self, wallet_data: Dict, coin_symbol: str) -> Dict[str, float]:
        """Build feature dictionary for model input."""
        return {
            "transaction_frequency": wallet_data.get("tx_count_7d", 0),
            "avg_transaction_size": wallet_data.get("avg_tx_size", 0),
            "wallet_age_days": wallet_data.get("age_days", 0),
            "total_balance": wallet_data.get("balance", 0),
            "sentiment_score": wallet_data.get("sentiment", 0),  # From social data
            "market_volatility": wallet_data.get("volatility", 0.5)
        }

    def _estimate_amount(self, wallet_data: Dict, prediction: Dict) -> Optional[float]:
        """Estimate transaction amount based on wallet data and prediction."""
        if prediction["action"] == "hold":
            return None

        # Simple estimate: percentage of balance
        balance = wallet_data.get("balance", 0)
        avg_tx_size = wallet_data.get("avg_tx_size", 0)

        # Use historical average or portion of balance
        estimated = min(avg_tx_size * 1.5, balance * 0.3)

        return round(estimated, 2) if estimated > 0 else None

    def _explain_factors(self, features: Dict, prediction: Dict) -> Dict[str, str]:
        """Generate explanation for prediction factors."""
        factors = {}

        if features["transaction_frequency"] > 5:
            factors["recent_activity"] = "high"
        elif features["transaction_frequency"] > 2:
            factors["recent_activity"] = "moderate"
        else:
            factors["recent_activity"] = "low"

        if features["sentiment_score"] > 0.3:
            factors["market_sentiment"] = "bullish"
        elif features["sentiment_score"] < -0.3:
            factors["market_sentiment"] = "bearish"
        else:
            factors["market_sentiment"] = "neutral"

        factors["historical_pattern"] = "matches_previous_behavior"

        return factors
