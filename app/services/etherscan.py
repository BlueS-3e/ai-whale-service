"""Etherscan-compatible explorer service for wallet transaction history."""

from __future__ import annotations

from typing import Dict, List

import httpx

from app.core.config import settings


class EtherscanService:
    """Fetch account-level data from Etherscan-compatible APIs."""

    _BASE_URLS = {
        "ethereum": "https://api.etherscan.io/api",
        "bsc": "https://api.bscscan.com/api",
        "polygon": "https://api.polygonscan.com/api",
    }

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or settings.ETHERSCAN_API_KEY

    async def get_transactions(
        self,
        address: str,
        chain: str = "ethereum",
        start_block: int = 0,
        end_block: int = 99999999,
        limit: int = 10,
    ) -> List[Dict]:
        """Fetch recent normal transactions for a wallet address."""
        base_url = self._BASE_URLS.get(chain.lower())
        if not base_url:
            return []

        params = {
            "module": "account",
            "action": "txlist",
            "address": address,
            "startblock": start_block,
            "endblock": end_block,
            "sort": "desc",
        }
        if self.api_key:
            params["apikey"] = self.api_key

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()

        result = data.get("result", [])
        if not isinstance(result, list):
            return []

        if limit <= 0:
            return []

        return result[:limit]
