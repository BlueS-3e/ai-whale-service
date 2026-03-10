"""
Web3 Blockchain RPC Connection Module

Handles connections to multiple blockchain RPC endpoints for real-time data fetching.
Supports Ethereum, Solana, BSC, Polygon, and other EVM chains.
"""

import os
from typing import Dict, List, Optional, Any
from web3 import Web3
# geth_poa_middleware is deprecated in web3 v7+
# from web3.middleware import geth_poa_middleware
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class BlockchainRPC:
    """Manages RPC connections to multiple blockchains"""

    def __init__(self):
        self.connections: Dict[str, Web3] = {}
        self._initialize_connections()

    def _initialize_connections(self):
        """Initialize RPC connections for supported chains"""
        rpc_urls = {
            'ethereum': os.getenv('ETHEREUM_RPC_URL', 'https://eth.llamarpc.com'),
            'bsc': os.getenv('BSC_RPC_URL', 'https://bsc-dataseed.binance.org'),
            'polygon': os.getenv('POLYGON_RPC_URL', 'https://polygon-rpc.com'),
            'arbitrum': os.getenv('ARBITRUM_RPC_URL', 'https://arb1.arbitrum.io/rpc'),
            'base': os.getenv('BASE_RPC_URL', 'https://mainnet.base.org'),
        }

        for chain, url in rpc_urls.items():
            try:
                w3 = Web3(Web3.HTTPProvider(url))

                # Note: geth_poa_middleware is deprecated in web3 v7+
                # PoA chains (BSC, Polygon) work without it in newer versions
                # If needed, use: from web3.middleware import ExtraDataToPOAMiddleware

                if w3.is_connected():
                    self.connections[chain] = w3
                    logger.info(f"Connected to {chain} RPC")
                else:
                    logger.warning(f"Failed to connect to {chain} RPC")
            except Exception as e:
                logger.error(f"Error connecting to {chain}: {e}")

    def get_connection(self, chain: str = 'ethereum') -> Optional[Web3]:
        """Get Web3 connection for specified chain"""
        return self.connections.get(chain.lower())

    async def get_wallet_balance(self, address: str, chain: str = 'ethereum') -> Dict[str, Any]:
        """Get native token balance for a wallet"""
        w3 = self.get_connection(chain)
        if not w3:
            return {'error': f'Chain {chain} not connected'}

        try:
            balance_wei = w3.eth.get_balance(address)
            balance_eth = w3.from_wei(balance_wei, 'ether')

            return {
                'address': address,
                'chain': chain,
                'balance': float(balance_eth),
                'balance_wei': str(balance_wei),
                'symbol': self._get_native_symbol(chain),
            }
        except Exception as e:
            logger.error(f"Error fetching balance for {address} on {chain}: {e}")
            return {'error': str(e)}

    async def get_transaction(self, tx_hash: str, chain: str = 'ethereum') -> Dict[str, Any]:
        """Get transaction details"""
        w3 = self.get_connection(chain)
        if not w3:
            return {'error': f'Chain {chain} not connected'}

        try:
            tx = w3.eth.get_transaction(tx_hash)
            receipt = w3.eth.get_transaction_receipt(tx_hash)

            return {
                'hash': tx_hash,
                'from': tx['from'],
                'to': tx['to'],
                'value': str(w3.from_wei(tx['value'], 'ether')),
                'gas_used': receipt['gasUsed'],
                'status': receipt['status'],
                'block_number': tx['blockNumber'],
                'chain': chain,
            }
        except Exception as e:
            logger.error(f"Error fetching transaction {tx_hash} on {chain}: {e}")
            return {'error': str(e)}

    async def get_recent_whale_transactions(
        self,
        chain: str = 'ethereum',
        min_value_eth: float = 10.0,
        blocks_back: int = 10
    ) -> List[Dict[str, Any]]:
        """Fetch recent large transactions (whale activity)"""
        w3 = self.get_connection(chain)
        if not w3:
            return []

        try:
            current_block = w3.eth.block_number
            whale_txs = []
            min_value_wei = w3.to_wei(min_value_eth, 'ether')

            # Scan recent blocks for whale transactions
            for block_num in range(current_block - blocks_back, current_block):
                block = w3.eth.get_block(block_num, full_transactions=True)

                for tx in block['transactions']:
                    if tx['value'] >= min_value_wei:
                        whale_txs.append({
                            'hash': tx['hash'].hex(),
                            'from': tx['from'],
                            'to': tx['to'],
                            'value_eth': float(w3.from_wei(tx['value'], 'ether')),
                            'block_number': block_num,
                            'timestamp': block['timestamp'],
                            'chain': chain,
                        })

            return sorted(whale_txs, key=lambda x: x['value_eth'], reverse=True)[:50]
        except Exception as e:
            logger.error(f"Error fetching whale transactions on {chain}: {e}")
            return []

    async def get_token_balance(
        self,
        wallet_address: str,
        token_address: str,
        chain: str = 'ethereum'
    ) -> Dict[str, Any]:
        """Get ERC20 token balance"""
        w3 = self.get_connection(chain)
        if not w3:
            return {'error': f'Chain {chain} not connected'}

        try:
            # ERC20 balanceOf ABI
            abi = [{
                "constant": True,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "type": "function"
            }]

            contract = w3.eth.contract(address=token_address, abi=abi)
            balance = contract.functions.balanceOf(wallet_address).call()

            return {
                'wallet': wallet_address,
                'token': token_address,
                'balance': str(balance),
                'balance_formatted': float(w3.from_wei(balance, 'ether')),
                'chain': chain,
            }
        except Exception as e:
            logger.error(f"Error fetching token balance: {e}")
            return {'error': str(e)}

    def _get_native_symbol(self, chain: str) -> str:
        """Get native token symbol for chain"""
        symbols = {
            'ethereum': 'ETH',
            'bsc': 'BNB',
            'polygon': 'MATIC',
            'arbitrum': 'ETH',
            'base': 'ETH',
        }
        return symbols.get(chain.lower(), 'UNKNOWN')

    def get_supported_chains(self) -> List[str]:
        """Get list of connected chains"""
        return list(self.connections.keys())

    def health_check(self) -> Dict[str, Any]:
        """Check health of all RPC connections"""
        health = {}
        for chain, w3 in self.connections.items():
            try:
                block = w3.eth.block_number
                health[chain] = {
                    'connected': True,
                    'latest_block': block,
                    'syncing': w3.eth.syncing,
                }
            except Exception as e:
                health[chain] = {
                    'connected': False,
                    'error': str(e),
                }
        return health


# Global RPC instance
blockchain_rpc = BlockchainRPC()
