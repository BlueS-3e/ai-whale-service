# Web3 Integration Requirements

## Python Backend Dependencies

Add to your `requirements.txt`:

```txt
# Web3 - Blockchain Integration
web3==6.15.1
websockets==12.0
eth-account==0.11.0
solana==0.30.2
base58==2.1.1

# Cryptography
ecdsa==0.18.0
eth-utils==2.3.1
```

Install:
```bash
pip install web3 websockets eth-account solana base58 ecdsa eth-utils
```

## Environment Variables

Add to your `.env`:

```env
# Blockchain RPC Endpoints (Free tier)
ETHEREUM_RPC_URL=https://eth.llamarpc.com
BSC_RPC_URL=https://bsc-dataseed.binance.org
POLYGON_RPC_URL=https://polygon-rpc.com
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
BASE_RPC_URL=https://mainnet.base.org

# WebSocket Endpoints (Optional - for real-time)
ETHEREUM_WS_URL=wss://eth-mainnet.g.alchemy.com/v2/demo
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com

# Paid RPC Services (Better performance)
# ALCHEMY_API_KEY=your_key_here
# INFURA_API_KEY=your_key_here
# QUICKNODE_URL=your_url_here

# Blockchain Explorers (for verification)
ETHERSCAN_API_KEY=your_key_here  # Get from https://etherscan.io/apis
BSCSCAN_API_KEY=your_key_here
POLYGONSCAN_API_KEY=your_key_here
```

## Frontend Dependencies

Already included in package.json, just run:

```bash
cd apps/demo-dashboard
npm install
```

## Getting Free RPC Access

### Ethereum RPC (Free Options)
1. **LlamaNodes** - https://llamanodes.com/ (No signup, 100% free)
2. **Ankr** - https://www.ankr.com/rpc/ (Free tier: 500M requests/month)
3. **Alchemy** - https://www.alchemy.com/ (Free tier: 300M compute units/month)

### BSC RPC (Free)
- Official: https://bsc-dataseed.binance.org/ (Rate limited but free)

### Polygon RPC (Free)
- Official: https://polygon-rpc.com/ (Free, no signup)

### Get API Keys

**Etherscan (for transaction history):**
1. Go to https://etherscan.io/apis
2. Sign up (free)
3. Create API key
4. Add to `.env` as `ETHERSCAN_API_KEY`

**Alchemy (for WebSockets):**
1. Go to https://www.alchemy.com/
2. Create free account
3. Create app (select Ethereum Mainnet)
4. Get your API key
5. Use in WebSocket URL: `wss://eth-mainnet.g.alchemy.com/v2/YOUR_KEY`

## Testing Web3 Integration

### 1. Test Backend RPC Connection

```bash
python -c "from app.core.blockchain.rpc import blockchain_rpc; print(blockchain_rpc.health_check())"
```

Expected output:
```json
{
  "ethereum": {"connected": true, "latest_block": 19234567, "syncing": false},
  "bsc": {"connected": true, "latest_block": 35671234, "syncing": false},
  ...
}
```

### 2. Test Wallet Balance Fetching

```python
import asyncio
from app.core.blockchain.rpc import blockchain_rpc

async def test():
    balance = await blockchain_rpc.get_wallet_balance(
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",  # Example address
        "ethereum"
    )
    print(balance)

asyncio.run(test())
```

### 3. Test Frontend Wallet Connection

1. Start demo dashboard: `cd apps/demo-dashboard && npm run dev`
2. Visit http://localhost:3000
3. Click "Connect Wallet"
4. Connect MetaMask or WalletConnect
5. Check browser console for connection logs

## Adding Web3 Endpoints to API

Create `app/api/v1/endpoints/web3.py`:

```python
from fastapi import APIRouter, Depends
from app.core.blockchain.rpc import blockchain_rpc
from app.models.schemas import WalletBalanceRequest, TransactionRequest

router = APIRouter()

@router.post("/balance")
async def get_balance(request: WalletBalanceRequest):
    """Get wallet balance on specified chain"""
    return await blockchain_rpc.get_wallet_balance(
        address=request.address,
        chain=request.chain
    )

@router.post("/whale-activity")
async def get_whale_activity(chain: str = "ethereum"):
    """Get recent whale transactions"""
    return await blockchain_rpc.get_recent_whale_transactions(
        chain=chain,
        min_value_eth=100.0,
        blocks_back=100
    )

@router.get("/chains")
async def get_supported_chains():
    """Get list of supported blockchains"""
    return {
        "chains": blockchain_rpc.get_supported_chains(),
        "health": blockchain_rpc.health_check()
    }
```

Register in `app/main.py`:

```python
from app.api.v1.endpoints import web3

app.include_router(web3.router, prefix="/v1/web3", tags=["web3"])
```

## WebSocket Real-time Monitoring

Start WebSocket listener:

```python
import asyncio
from app.core.blockchain.websocket import blockchain_ws

async def main():
    # Subscribe to whale wallet
    await blockchain_ws.subscribe_whale_wallet(
        address="0x...",
        chain="ethereum",
        callback=lambda data: print(f"Whale Alert: {data}")
    )
    
    # Start monitoring
    await blockchain_ws.start()

asyncio.run(main())
```

## Production Considerations

### Rate Limiting
Free RPC endpoints have rate limits. For production:
- **Alchemy**: 300M compute units/month free
- **Infura**: 100k requests/day free  
- **QuickNode**: $9/month for 5M requests

### Caching
Cache blockchain data in Redis:
```python
# Cache wallet balances for 60 seconds
@cache(ttl=60)
async def get_cached_balance(address: str, chain: str):
    return await blockchain_rpc.get_wallet_balance(address, chain)
```

### Error Handling
Always handle RPC failures gracefully:
```python
try:
    balance = await blockchain_rpc.get_wallet_balance(address, chain)
except Exception as e:
    logger.error(f"RPC error: {e}")
    return {"error": "Blockchain temporarily unavailable"}
```

## Next Steps

1. ✅ Install Python Web3 dependencies
2. ✅ Add RPC URLs to `.env`
3. ✅ Test RPC connections
4. ✅ Test frontend wallet connection
5. ⏳ Add Web3 endpoints to API
6. ⏳ Implement WebSocket monitoring
7. ⏳ Cache blockchain data
8. ⏳ Deploy to production

**Ready to integrate Web3!** 🚀
