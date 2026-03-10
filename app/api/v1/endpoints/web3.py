"""
Web3 API Endpoints

Provides blockchain data access via REST API.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel, Field
from app.core.blockchain.rpc import blockchain_rpc
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class WalletBalanceRequest(BaseModel):
    """Request model for wallet balance"""
    address: str = Field(..., description="Wallet address")
    chain: str = Field(default="ethereum", description="Blockchain name")


class TransactionRequest(BaseModel):
    """Request model for transaction lookup"""
    tx_hash: str = Field(..., description="Transaction hash")
    chain: str = Field(default="ethereum", description="Blockchain name")


class TokenBalanceRequest(BaseModel):
    """Request model for token balance"""
    wallet_address: str = Field(..., description="Wallet address")
    token_address: str = Field(..., description="Token contract address")
    chain: str = Field(default="ethereum", description="Blockchain name")


@router.post("/balance")
async def get_wallet_balance(request: WalletBalanceRequest):
    """
    Get native token balance for a wallet address

    Supports: ETH, BNB, MATIC, etc. depending on chain
    """
    try:
        balance = await blockchain_rpc.get_wallet_balance(
            address=request.address,
            chain=request.chain
        )

        if 'error' in balance:
            raise HTTPException(status_code=400, detail=balance['error'])

        return balance
    except Exception as e:
        logger.error(f"Error fetching balance: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transaction")
async def get_transaction(request: TransactionRequest):
    """
    Get transaction details by hash
    """
    try:
        tx = await blockchain_rpc.get_transaction(
            tx_hash=request.tx_hash,
            chain=request.chain
        )

        if 'error' in tx:
            raise HTTPException(status_code=404, detail=tx['error'])

        return tx
    except Exception as e:
        logger.error(f"Error fetching transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/whale-activity")
async def get_whale_activity(
    chain: str = Query(default="ethereum", description="Blockchain name"),
    min_value_eth: float = Query(default=10.0, description="Minimum transaction value in ETH"),
    blocks_back: int = Query(default=10, ge=1, le=100, description="Number of blocks to scan")
):
    """
    Get recent large transactions (whale activity)

    Scans recent blocks for transactions above threshold.
    Useful for real-time whale tracking.
    """
    try:
        transactions = await blockchain_rpc.get_recent_whale_transactions(
            chain=chain,
            min_value_eth=min_value_eth,
            blocks_back=blocks_back
        )

        return {
            "chain": chain,
            "min_value_eth": min_value_eth,
            "blocks_scanned": blocks_back,
            "transactions_found": len(transactions),
            "transactions": transactions
        }
    except Exception as e:
        logger.error(f"Error fetching whale activity: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/token-balance")
async def get_token_balance(request: TokenBalanceRequest):
    """
    Get ERC20 token balance for a wallet
    """
    try:
        balance = await blockchain_rpc.get_token_balance(
            wallet_address=request.wallet_address,
            token_address=request.token_address,
            chain=request.chain
        )

        if 'error' in balance:
            raise HTTPException(status_code=400, detail=balance['error'])

        return balance
    except Exception as e:
        logger.error(f"Error fetching token balance: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chains")
async def get_supported_chains():
    """
    Get list of supported blockchain networks and their health status
    """
    try:
        chains = blockchain_rpc.get_supported_chains()
        health = blockchain_rpc.health_check()

        return {
            "supported_chains": chains,
            "chain_status": health,
            "total_chains": len(chains),
        }
    except Exception as e:
        logger.error(f"Error fetching chains: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def web3_health_check():
    """
    Health check for all Web3 RPC connections
    """
    try:
        health = blockchain_rpc.health_check()

        # Check if any chains are connected
        connected_chains = [
            chain for chain, status in health.items()
            if status.get('connected', False)
        ]

        if not connected_chains:
            raise HTTPException(
                status_code=503,
                detail="No blockchain connections available"
            )

        return {
            "status": "healthy",
            "connected_chains": connected_chains,
            "total_chains": len(health),
            "details": health,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Web3 health check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
