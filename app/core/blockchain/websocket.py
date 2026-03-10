"""
WebSocket Module for Real-time Blockchain Monitoring

Listens to blockchain events in real-time using WebSocket connections.
Critical for whale tracking and instant alerts.
"""

import asyncio
import json
import logging
from typing import Callable, Dict, Any, List
from websockets import connect
from web3 import Web3

logger = logging.getLogger(__name__)


class BlockchainWebSocket:
    """Manages WebSocket connections for real-time blockchain monitoring"""

    def __init__(self):
        self.connections: Dict[str, Any] = {}
        self.subscribers: Dict[str, List[Callable]] = {}
        self.running = False

    async def connect_ethereum(self, ws_url: str = "wss://eth-mainnet.g.alchemy.com/v2/demo"):
        """Connect to Ethereum WebSocket"""
        try:
            async with connect(ws_url) as websocket:
                logger.info("Connected to Ethereum WebSocket")
                self.connections['ethereum'] = websocket

                # Subscribe to new block headers
                subscribe_msg = {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "eth_subscribe",
                    "params": ["newHeads"]
                }
                await websocket.send(json.dumps(subscribe_msg))

                # Listen for new blocks
                while self.running:
                    response = await websocket.recv()
                    await self._handle_ethereum_message(response)
        except Exception as e:
            logger.error(f"Ethereum WebSocket error: {e}")

    async def connect_solana(self, ws_url: str = "wss://api.mainnet-beta.solana.com"):
        """Connect to Solana WebSocket"""
        try:
            async with connect(ws_url) as websocket:
                logger.info("Connected to Solana WebSocket")
                self.connections['solana'] = websocket

                # Subscribe to account changes (whale wallets)
                subscribe_msg = {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "accountSubscribe",
                    "params": [
                        "whale_address_here",  # Replace with actual whale addresses
                        {"encoding": "jsonParsed"}
                    ]
                }
                await websocket.send(json.dumps(subscribe_msg))

                # Listen for account updates
                while self.running:
                    response = await websocket.recv()
                    await self._handle_solana_message(response)
        except Exception as e:
            logger.error(f"Solana WebSocket error: {e}")

    async def subscribe_whale_wallet(
        self,
        address: str,
        chain: str,
        callback: Callable
    ):
        """Subscribe to whale wallet activity"""
        key = f"{chain}:{address}"

        if key not in self.subscribers:
            self.subscribers[key] = []

        self.subscribers[key].append(callback)
        logger.info(f"Subscribed to whale wallet: {address} on {chain}")

    async def _handle_ethereum_message(self, message: str):
        """Process incoming Ethereum WebSocket messages"""
        try:
            data = json.loads(message)

            # New block received
            if 'params' in data and 'result' in data['params']:
                block = data['params']['result']
                await self._notify_subscribers('ethereum:new_block', {
                    'number': int(block.get('number', '0x0'), 16),
                    'hash': block.get('hash'),
                    'timestamp': int(block.get('timestamp', '0x0'), 16),
                })
        except Exception as e:
            logger.error(f"Error handling Ethereum message: {e}")

    async def _handle_solana_message(self, message: str):
        """Process incoming Solana WebSocket messages"""
        try:
            data = json.loads(message)

            # Account change notification
            if 'params' in data:
                account_data = data['params']['result']
                await self._notify_subscribers('solana:account_change', {
                    'pubkey': account_data.get('pubkey'),
                    'lamports': account_data.get('lamports'),
                })
        except Exception as e:
            logger.error(f"Error handling Solana message: {e}")

    async def _notify_subscribers(self, event_type: str, data: Dict[str, Any]):
        """Notify all subscribers of an event"""
        if event_type in self.subscribers:
            for callback in self.subscribers[event_type]:
                try:
                    await callback(data)
                except Exception as e:
                    logger.error(f"Error in subscriber callback: {e}")

    async def start(self):
        """Start WebSocket listeners"""
        self.running = True

        # Start listeners for all chains
        tasks = [
            asyncio.create_task(self.connect_ethereum()),
            # asyncio.create_task(self.connect_solana()),  # Uncomment when ready
        ]

        await asyncio.gather(*tasks, return_exceptions=True)

    async def stop(self):
        """Stop all WebSocket connections"""
        self.running = False
        for chain, ws in self.connections.items():
            try:
                await ws.close()
                logger.info(f"Closed {chain} WebSocket")
            except Exception as e:
                logger.error(f"Error closing {chain} WebSocket: {e}")


# Global WebSocket instance
blockchain_ws = BlockchainWebSocket()


# Example usage function
async def monitor_whale_transfers(whale_address: str, min_value_eth: float = 100.0):
    """
    Monitor a whale wallet for large transfers

    Usage:
        asyncio.run(monitor_whale_transfers("0x..."))
    """

    async def on_transfer(data: Dict[str, Any]):
        print("🐋 Whale Transfer Detected!")
        print(f"   Value: {data['value_eth']} ETH")
        print(f"   From: {data['from']}")
        print(f"   To: {data['to']}")

    await blockchain_ws.subscribe_whale_wallet(
        address=whale_address,
        chain='ethereum',
        callback=on_transfer
    )

    await blockchain_ws.start()
