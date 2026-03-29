"""
Contract interaction layer for WhalePredictor smart contract.

Handles on-chain recording of AI predictions for transparency and verification.
"""

import json
import logging
from typing import Dict, List, Optional, Tuple
from web3 import Web3
from eth_account import Account
from app.core.config import settings

logger = logging.getLogger(__name__)


class ContractInteractionError(Exception):
    """Raised when contract interaction fails"""
    pass


class WhaleContractManager:
    """Manages interactions with WhalePredictor smart contract"""
    
    # Contract ABI (stripped down for essentials)
    CONTRACT_ABI = json.loads('''[
        {
            "inputs": [{"internalType": "bytes32", "name": "_predictionHash", "type": "bytes32"},
                       {"internalType": "string", "name": "_walletAddress", "type": "string"},
                       {"internalType": "string", "name": "_coinSymbol", "type": "string"},
                       {"internalType": "uint256", "name": "_riskScore", "type": "uint256"},
                       {"internalType": "string", "name": "_timeframe", "type": "string"}],
            "name": "recordPrediction",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "_limit", "type": "uint256"}],
            "name": "getLatestPredictions",
            "outputs": [
                {
                    "components": [
                        {"internalType": "address", "name": "predictor", "type": "address"},
                        {"internalType": "bytes32", "name": "predictionHash", "type": "bytes32"},
                        {"internalType": "string", "name": "walletAddress", "type": "string"},
                        {"internalType": "string", "name": "coinSymbol", "type": "string"},
                        {"internalType": "uint256", "name": "riskScore", "type": "uint256"},
                        {"internalType": "string", "name": "timeframe", "type": "string"},
                        {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                        {"internalType": "uint256", "name": "blockNumber", "type": "uint256"}
                    ],
                    "internalType": "struct WhalePredictor.Prediction[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "bytes32", "name": "_predictionHash", "type": "bytes32"}],
            "name": "getPredictionByHash",
            "outputs": [
                {
                    "components": [
                        {"internalType": "address", "name": "predictor", "type": "address"},
                        {"internalType": "bytes32", "name": "predictionHash", "type": "bytes32"},
                        {"internalType": "string", "name": "walletAddress", "type": "string"},
                        {"internalType": "string", "name": "coinSymbol", "type": "string"},
                        {"internalType": "uint256", "name": "riskScore", "type": "uint256"},
                        {"internalType": "string", "name": "timeframe", "type": "string"},
                        {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                        {"internalType": "uint256", "name": "blockNumber", "type": "uint256"}
                    ],
                    "internalType": "struct WhalePredictor.Prediction",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getTotalPredictions",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]''')
    
    def __init__(
        self,
        contract_address: str,
        chain: str = "bsc",
        private_key: Optional[str] = None
    ):
        """
        Initialize contract manager
        
        Args:
            contract_address: Deployed contract address
            chain: Blockchain network ("bsc" for BSC, "ethereum" for Ethereum, etc.)
            private_key: Private key for signing transactions (use env var in prod)
        """
        self.contract_address = Web3.to_checksum_address(contract_address)
        self.chain = chain
        self.private_key = private_key or settings.CONTRACT_PRIVATE_KEY
        
        # Get RPC endpoint
        self.rpc_url = self._get_rpc_url()
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        if not self.w3.is_connected():
            raise ContractInteractionError(f"Cannot connect to {chain} RPC: {self.rpc_url}")
        
        # Initialize contract
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=self.CONTRACT_ABI
        )
        
        # Set account for signing transactions
        if self.private_key:
            self.account = Account.from_key(self.private_key)
        else:
            self.account = None
        
        logger.info(f"WhaleContractManager initialized for {chain}: {contract_address}")
    
    def _get_rpc_url(self) -> str:
        """Get RPC URL for chain"""
        rpc_map = {
            "bsc": settings.BSC_RPC_URL,
            "ethereum": settings.ETHEREUM_RPC_URL,
            "polygon": settings.POLYGON_RPC_URL,
            "arbitrum": settings.ARBITRUM_RPC_URL,
            "base": settings.BASE_RPC_URL,
        }
        
        rpc_url = rpc_map.get(self.chain.lower())
        if not rpc_url:
            raise ValueError(f"Unsupported chain: {self.chain}")
        
        return rpc_url
    
    def record_prediction(
        self,
        prediction_data: Dict,
        gas_limit: int = 200000,
        wait_for_receipt: bool = True,
        timeout: int = 120
    ) -> Dict:
        """
        Record a prediction on-chain
        
        Args:
            prediction_data: Dictionary with keys:
                - wallet_address: str (the whale wallet being analyzed)
                - coin_symbol: str (e.g., "BTC", "ETH", "BNB")
                - risk_score: int (0-100)
                - timeframe: str (e.g., "24h", "7d")
                - model_output: dict (raw model prediction for hashing)
            gas_limit: Maximum gas to use
            wait_for_receipt: Whether to wait for transaction confirmation
            timeout: Seconds to wait for receipt
        
        Returns:
            Dictionary with:
                - tx_hash: Transaction hash
                - contract_tx: Full transaction details
                - prediction_hash: Hash of the prediction on-chain
                - block_number: Block where transaction was included
                - status: "success" or "failed"
        """
        if not self.account:
            raise ContractInteractionError("Private key not configured for transactions")
        
        try:
            # Hash the prediction data for on-chain storage
            prediction_dict = {
                "wallet_address": prediction_data.get("wallet_address"),
                "coin_symbol": prediction_data.get("coin_symbol"),
                "risk_score": prediction_data.get("risk_score"),
                "timeframe": prediction_data.get("timeframe"),
                "model_output": prediction_data.get("model_output"),
                "timestamp": prediction_data.get("timestamp")
            }
            
            # Keccak256 hash of prediction JSON
            prediction_json = json.dumps(prediction_dict, sort_keys=True)
            prediction_hash = Web3.keccak(text=prediction_json)
            
            logger.info(f"Recording prediction on {self.chain}: {prediction_data['wallet_address']}")
            
            # Build transaction
            tx_dict = self.contract.functions.recordPrediction(
                prediction_hash,
                prediction_data["wallet_address"],
                prediction_data["coin_symbol"],
                prediction_data["risk_score"],
                prediction_data["timeframe"]
            ).build_transaction({
                "from": self.account.address,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
                "gas": gas_limit,
                "gasPrice": self.w3.eth.gas_price,
                "chainId": self.w3.eth.chain_id
            })
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx_dict, self.private_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            logger.info(f"Prediction submitted: {tx_hash.hex()}")
            
            result = {
                "tx_hash": tx_hash.hex(),
                "prediction_hash": prediction_hash.hex(),
                "status": "pending",
                "chain": self.chain,
                "contract_address": self.contract_address
            }
            
            # Wait for receipt if requested
            if wait_for_receipt:
                try:
                    receipt = self.w3.eth.wait_for_transaction_receipt(
                        tx_hash,
                        timeout=timeout
                    )
                    
                    result["status"] = "success" if receipt["status"] == 1 else "failed"
                    result["block_number"] = receipt["blockNumber"]
                    result["gas_used"] = receipt["gasUsed"]
                    result["confirmation_date"] = receipt
                    
                    if result["status"] == "success":
                        logger.info(f"Prediction recorded successfully: {tx_hash.hex()}")
                    else:
                        logger.error(f"Transaction failed: {tx_hash.hex()}")
                        
                except Exception as e:
                    logger.warning(f"Could not wait for receipt: {e}")
                    result["status"] = "unknown"
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to record prediction: {e}")
            raise ContractInteractionError(f"Transaction failed: {str(e)}")
    
    def get_latest_predictions(self, limit: int = 10) -> List[Dict]:
        """
        Retrieve latest predictions from contract
        
        Args:
            limit: Maximum predictions to return (0 for all)
        
        Returns:
            List of prediction dictionaries
        """
        try:
            predictions = self.contract.functions.getLatestPredictions(limit).call()
            
            result = []
            for pred in predictions:
                result.append({
                    "predictor": pred[0],
                    "prediction_hash": pred[1].hex(),
                    "wallet_address": pred[2],
                    "coin_symbol": pred[3],
                    "risk_score": pred[4],
                    "timeframe": pred[5],
                    "timestamp": pred[6],
                    "block_number": pred[7]
                })
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to get predictions: {e}")
            return []
    
    def get_prediction_by_hash(self, prediction_hash: str) -> Optional[Dict]:
        """
        Retrieve a specific prediction by its hash
        
        Args:
            prediction_hash: The prediction hash (hex string)
        
        Returns:
            Prediction dictionary or None if not found
        """
        try:
            hash_bytes = bytes.fromhex(prediction_hash.replace("0x", ""))
            prediction = self.contract.functions.getPredictionByHash(hash_bytes).call()
            
            return {
                "predictor": prediction[0],
                "prediction_hash": prediction[1].hex(),
                "wallet_address": prediction[2],
                "coin_symbol": prediction[3],
                "risk_score": prediction[4],
                "timeframe": prediction[5],
                "timestamp": prediction[6],
                "block_number": prediction[7]
            }
            
        except Exception as e:
            logger.error(f"Failed to get prediction: {e}")
            return None
    
    def get_total_predictions(self) -> int:
        """Get total count of predictions recorded"""
        try:
            return self.contract.functions.getTotalPredictions().call()
        except Exception as e:
            logger.error(f"Failed to get total predictions: {e}")
            return 0
    
    def health_check(self) -> Dict:
        """Check contract and RPC connection health"""
        try:
            total = self.get_total_predictions()
            latest_block = self.w3.eth.block_number
            
            return {
                "connected": True,
                "contract_address": self.contract_address,
                "chain": self.chain,
                "predictions_recorded": total,
                "latest_block": latest_block,
                "rpc_url": self.rpc_url
            }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "connected": False,
                "error": str(e),
                "contract_address": self.contract_address,
                "chain": self.chain
            }


# Global contract manager instance (initialized in main.py)
whale_contract: Optional[WhaleContractManager] = None


def initialize_contract_manager(
    contract_address: str,
    chain: str = "bsc",
    private_key: Optional[str] = None
) -> WhaleContractManager:
    """Initialize global contract manager"""
    global whale_contract
    whale_contract = WhaleContractManager(
        contract_address=contract_address,
        chain=chain,
        private_key=private_key
    )
    return whale_contract


def get_contract_manager() -> Optional[WhaleContractManager]:
    """Get global contract manager"""
    return whale_contract
