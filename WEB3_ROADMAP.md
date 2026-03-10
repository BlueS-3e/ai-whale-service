# 🌐 Web3 Integration Roadmap for AI Whale Service

## Current Status: ✅ Foundation Ready

Your platform now has Web3-ready architecture. Here's what's implemented and what's next.

---

## ✅ Phase 1: COMPLETED - Web3 Foundation

### Frontend Web3 Components
- ✅ **Wallet Connection** (`apps/demo-dashboard/components/wallet-connect.tsx`)
  - MetaMask integration
  - Account detection
  - Chain switching
  - Display wallet address and balance

- ✅ **useWeb3 Hook** (`apps/demo-dashboard/hooks/useWeb3.ts`)
  - Connect/disconnect wallet
  - Listen for account changes
  - Listen for chain changes
  - Get current chain name

- ✅ **Multi-Chain Config** (`apps/demo-dashboard/lib/web3-config.ts`)
  - Ethereum, BSC, Polygon, Base, Arbitrum, Optimism
  - RPC URLs for all chains
  - Chain metadata (explorer, native currency)

### Architecture
- ✅ API client ready for backend communication
- ✅ Environment variables configured
- ✅ TypeScript types for Web3 data

---

## 🔨 Phase 2: Backend Web3 Integration (NEXT)

### 2.1: Add Web3 Libraries

```bash
# Install Python Web3 dependencies
pip install web3 eth-account eth-abi
pip install solana solders  # For Solana support
pip install httpx aiohttp  # For async RPC calls
```

Add to `requirements.txt`:
```
web3==6.15.1
eth-account==0.10.0
eth-abi==4.2.1
solana==0.32.0
httpx==0.25.2
aiohttp==3.9.1
```

### 2.2: Create Blockchain Service Layer

**File:** `app/services/blockchain_rpc.py`
```python
from web3 import Web3
from typing import Dict, List, Optional
import asyncio

class BlockchainRPCService:
    def __init__(self):
        self.providers = {
            "ethereum": Web3(Web3.HTTPProvider("https://eth.llamarpc.com")),
            "bsc": Web3(Web3.HTTPProvider("https://bsc-dataseed.binance.org")),
            "polygon": Web3(Web3.HTTPProvider("https://polygon-rpc.com")),
        }
    
    async def get_wallet_balance(
        self, 
        wallet_address: str, 
        chain: str = "ethereum"
    ) -> Dict:
        """Get native token balance for a wallet"""
        w3 = self.providers.get(chain)
        if not w3:
            raise ValueError(f"Unsupported chain: {chain}")
        
        balance_wei = w3.eth.get_balance(wallet_address)
        balance_eth = w3.from_wei(balance_wei, 'ether')
        
        return {
            "address": wallet_address,
            "chain": chain,
            "balance": float(balance_eth),
            "balance_wei": balance_wei
        }
    
    async def get_transaction_history(
        self,
        wallet_address: str,
        chain: str = "ethereum",
        limit: int = 10
    ) -> List[Dict]:
        """Fetch recent transactions for a wallet"""
        # This requires an indexer API like Etherscan
        # For now, return structure
        return [
            {
                "hash": "0x...",
                "from": "0x...",
                "to": "0x...",
                "value": "1.5",
                "timestamp": "2026-03-09T12:00:00Z"
            }
        ]
    
    async def monitor_whale_wallet(
        self,
        wallet_address: str,
        threshold_eth: float = 100.0
    ):
        """Real-time monitoring for large movements"""
        # WebSocket implementation
        pass
```

**File:** `app/services/etherscan.py`
```python
import httpx
from typing import List, Dict
from app.core.config import settings

class EtherscanService:
    BASE_URL = "https://api.etherscan.io/api"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def get_transactions(
        self,
        address: str,
        start_block: int = 0,
        end_block: int = 99999999
    ) -> List[Dict]:
        """Fetch transaction history from Etherscan"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.BASE_URL,
                params={
                    "module": "account",
                    "action": "txlist",
                    "address": address,
                    "startblock": start_block,
                    "endblock": end_block,
                    "sort": "desc",
                    "apikey": self.api_key
                }
            )
            data = response.json()
            
            if data["status"] == "1":
                return data["result"]
            return []
    
    async def get_token_balance(
        self,
        address: str,
        contract_address: str
    ) -> Dict:
        """Get ERC-20 token balance"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.BASE_URL,
                params={
                    "module": "account",
                    "action": "tokenbalance",
                    "contractaddress": contract_address,
                    "address": address,
                    "tag": "latest",
                    "apikey": self.api_key
                }
            )
            data = response.json()
            return {
                "address": address,
                "token": contract_address,
                "balance": data.get("result", "0")
            }
```

### 2.3: Create Web3 API Endpoints

**File:** `app/api/v1/endpoints/web3.py`
```python
from fastapi import APIRouter, Depends, HTTPException
from app.services.blockchain_rpc import BlockchainRPCService
from app.schemas.web3 import WalletBalanceRequest, WalletBalanceResponse
from app.core.security import verify_api_key

router = APIRouter()
blockchain_service = BlockchainRPCService()

@router.post("/wallet/balance", response_model=WalletBalanceResponse)
async def get_wallet_balance(
    request: WalletBalanceRequest,
    api_key: str = Depends(verify_api_key)
):
    """Get wallet balance across chains"""
    try:
        balance = await blockchain_service.get_wallet_balance(
            request.wallet_address,
            request.chain
        )
        return balance
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/wallet/transactions")
async def get_wallet_transactions(
    wallet_address: str,
    chain: str = "ethereum",
    limit: int = 10,
    api_key: str = Depends(verify_api_key)
):
    """Get transaction history for a wallet"""
    transactions = await blockchain_service.get_transaction_history(
        wallet_address, chain, limit
    )
    return {"transactions": transactions}
```

### 2.4: Add Web3 Schemas

**File:** `app/schemas/web3.py`
```python
from pydantic import BaseModel, Field
from typing import Optional, List

class WalletBalanceRequest(BaseModel):
    wallet_address: str = Field(..., description="Ethereum-style address")
    chain: str = Field(default="ethereum", description="Blockchain network")

class WalletBalanceResponse(BaseModel):
    address: str
    chain: str
    balance: float
    balance_wei: int

class TransactionData(BaseModel):
    hash: str
    from_address: str = Field(..., alias="from")
    to_address: str = Field(..., alias="to")
    value: str
    timestamp: str
    gas_used: Optional[int] = None
    
    class Config:
        populate_by_name = True
```

### 2.5: Update Configuration

**File:** `app/core/config.py`
```python
class Settings(BaseSettings):
    # ... existing settings ...
    
    # Web3 RPC URLs
    ETHEREUM_RPC_URL: str = "https://eth.llamarpc.com"
    BSC_RPC_URL: str = "https://bsc-dataseed.binance.org"
    POLYGON_RPC_URL: str = "https://polygon-rpc.com"
    BASE_RPC_URL: str = "https://mainnet.base.org"
    
    # Blockchain Explorer APIs
    ETHERSCAN_API_KEY: Optional[str] = None
    BSCSCAN_API_KEY: Optional[str] = None
    POLYGONSCAN_API_KEY: Optional[str] = None
    
    # Solana
    SOLANA_RPC_URL: str = "https://api.mainnet-beta.solana.com"
```

---

## 🚀 Phase 3: Enhanced Whale Tracking with On-Chain Data

### 3.1: Integrate Real Blockchain Data

Update `app/services/whale_service.py`:
```python
from app.services.blockchain_rpc import BlockchainRPCService

class WhaleService:
    def __init__(self):
        self.blockchain = BlockchainRPCService()
    
    async def predict_movement_with_onchain_data(
        self,
        wallet_address: str,
        coin_symbol: str,
        timeframe: str = "24h"
    ):
        # 1. Get current wallet balance
        balance = await self.blockchain.get_wallet_balance(
            wallet_address, 
            chain="ethereum"
        )
        
        # 2. Fetch transaction history
        txs = await self.blockchain.get_transaction_history(
            wallet_address,
            chain="ethereum"
        )
        
        # 3. Analyze patterns with AI
        features = self._extract_features_from_txs(txs)
        prediction = self.model.predict(features)
        
        return {
            "wallet_address": wallet_address,
            "current_balance": balance["balance"],
            "movement_probability": prediction,
            "recent_activity": len(txs),
            # ... rest of prediction
        }
```

### 3.2: WebSocket for Real-Time Monitoring

**File:** `app/api/v1/websocket/whale_feed.py`
```python
from fastapi import WebSocket, WebSocketDisconnect
from app.services.blockchain_rpc import BlockchainRPCService
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/whale-feed")
async def whale_feed(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Monitor whale wallets
            whale_data = await check_whale_movements()
            await manager.broadcast(whale_data)
            await asyncio.sleep(5)  # Check every 5 seconds
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

---

## 💰 Phase 4: Crypto Payments Integration

### 4.1: Accept USDC for Subscriptions

```python
# app/services/crypto_payments.py
from web3 import Web3
from eth_account.messages import encode_defunct

class CryptoPaymentService:
    USDC_CONTRACT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    USDC_ABI = [...]  # ERC-20 ABI
    
    async def verify_payment(
        self,
        tx_hash: str,
        expected_amount: float,
        user_address: str
    ) -> bool:
        """Verify a USDC payment transaction"""
        w3 = Web3(Web3.HTTPProvider(settings.ETHEREUM_RPC_URL))
        
        # Get transaction
        tx = w3.eth.get_transaction(tx_hash)
        
        # Verify it's to our contract
        if tx['to'].lower() != self.USDC_CONTRACT.lower():
            return False
        
        # Decode transfer data
        # Verify amount and sender
        
        return True
```

### 4.2: NFT-Gated Access

```python
# app/services/nft_gate.py
class NFTGateService:
    PREMIUM_NFT_CONTRACT = "0x..."
    
    async def check_nft_ownership(
        self,
        wallet_address: str
    ) -> bool:
        """Check if user owns premium NFT"""
        w3 = Web3(Web3.HTTPProvider(settings.ETHEREUM_RPC_URL))
        
        contract = w3.eth.contract(
            address=self.PREMIUM_NFT_CONTRACT,
            abi=[...]  # ERC-721 ABI
        )
        
        balance = contract.functions.balanceOf(wallet_address).call()
        return balance > 0
```

---

## 🔐 Phase 5: Sign-In with Ethereum (SIWE)

### 5.1: Backend Implementation

```python
# app/api/v1/endpoints/auth.py
from siwe import SiweMessage
from datetime import datetime, timedelta

@router.post("/auth/siwe/challenge")
async def get_siwe_challenge(address: str):
    """Generate SIWE challenge for wallet"""
    nonce = generate_nonce()
    
    message = SiweMessage(
        domain="yourwhaleservice.com",
        address=address,
        statement="Sign in to AI Whale Service",
        uri="https://yourwhaleservice.com",
        version="1",
        chain_id=1,
        nonce=nonce,
        issued_at=datetime.utcnow().isoformat()
    )
    
    # Store nonce temporarily
    await redis.setex(f"nonce:{nonce}", 300, address)
    
    return {"message": message.prepare_message()}

@router.post("/auth/siwe/verify")
async def verify_siwe_signature(
    message: str,
    signature: str
):
    """Verify SIWE signature and create session"""
    try:
        siwe_message = SiweMessage.from_message(message)
        siwe_message.verify(signature)
        
        # Create JWT token
        token = create_access_token({"sub": siwe_message.address})
        
        return {"token": token, "address": siwe_message.address}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid signature")
```

### 5.2: Frontend Implementation

Update `apps/demo-dashboard/hooks/useWeb3.ts`:
```typescript
export function useWeb3Auth() {
  const signIn = async () => {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];
    
    // Get challenge
    const { message } = await fetch("/api/auth/siwe/challenge", {
      method: "POST",
      body: JSON.stringify({ address }),
    }).then(r => r.json());
    
    // Sign message
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });
    
    // Verify and get token
    const { token } = await fetch("/api/auth/siwe/verify", {
      method: "POST",
      body: JSON.stringify({ message, signature }),
    }).then(r => r.json());
    
    // Store token
    localStorage.setItem("authToken", token);
    
    return token;
  };
  
  return { signIn };
}
```

---

## 📊 Phase 6: Cross-Chain Whale Aggregation

### 6.1: Multi-Chain Monitoring

```python
# app/services/multi_chain_whale.py
class MultiChainWhaleService:
    async def track_whale_across_chains(
        self,
        wallet_address: str
    ) -> Dict:
        """Track whale activity across multiple chains"""
        
        chains = ["ethereum", "bsc", "polygon", "base"]
        
        tasks = [
            self.get_chain_activity(wallet_address, chain)
            for chain in chains
        ]
        
        results = await asyncio.gather(*tasks)
        
        return {
            "address": wallet_address,
            "chains": {
                chain: result
                for chain, result in zip(chains, results)
            },
            "total_value_usd": sum(r["value_usd"] for r in results)
        }
```

---

## ✅ Implementation Checklist

### Week 1: Core Web3 Backend
- [ ] Install web3 Python libraries
- [ ] Create `blockchain_rpc.py` service
- [ ] Add RPC URLs to config
- [ ] Create Web3 API endpoints
- [ ] Test wallet balance fetching

### Week 2: Blockchain Data Integration
- [ ] Sign up for Etherscan API key
- [ ] Implement transaction history fetching
- [ ] Integrate Etherscan service
- [ ] Update whale prediction with on-chain data
- [ ] Test with real wallet addresses

### Week 3: Real-Time Features
- [ ] Implement WebSocket endpoint
- [ ] Add whale wallet monitoring
- [ ] Create frontend WebSocket client
- [ ] Display real-time feed in demo dashboard
- [ ] Test with multiple concurrent connections

### Week 4: Advanced Features
- [ ] Implement crypto payment verification
- [ ] Add NFT gating logic
- [ ] Create SIWE authentication
- [ ] Add cross-chain aggregation
- [ ] Deploy to testnet for testing

---

## 🎯 Priority Order

**Must Have (Launch MVP):**
1. ✅ Wallet connection (DONE)
2. Real wallet balance fetching
3. Transaction history from Etherscan
4. Update whale predictions with on-chain data

**Should Have (Post-Launch):**
5. WebSocket real-time feed
6. Multi-chain support
7. SIWE authentication
8. Crypto payment acceptance

**Nice to Have (Future):**
9. NFT gating
10. DAO integration
11. ZK proofs
12. On-chain prediction storage

---

## 📚 Resources

### APIs & Services
- **Etherscan API:** https://etherscan.io/apis
- **BSCScan API:** https://bscscan.com/apis
- **Alchemy:** https://www.alchemy.com/
- **Infura:** https://www.infura.io/
- **Moralis:** https://moralis.io/
- **The Graph:** https://thegraph.com/

### Web3 Libraries
- **Web3.py:** https://web3py.readthedocs.io/
- **ethers.js:** https://docs.ethers.org/
- **SIWE:** https://docs.login.xyz/
- **RainbowKit:** https://www.rainbowkit.com/

### Learning
- **Web3.py Tutorial:** https://web3py.readthedocs.io/en/stable/quickstart.html
- **Ethereum JSON-RPC:** https://ethereum.org/en/developers/docs/apis/json-rpc/
- **Solana Web3.js:** https://solana-labs.github.io/solana-web3.js/

---

## 💡 Quick Wins

Start with these for immediate impact:

1. **Get Etherscan API Key** (Free)
   - Sign up at etherscan.io
   - Add to `.env`: `ETHERSCAN_API_KEY=your_key`
   - Fetch transaction history immediately

2. **Test with Real Wallets**
   - Use Vitalik's wallet: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
   - Whale wallet: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

3. **Add to Demo Dashboard**
   - Show real transaction count
   - Display actual balance
   - Show last transaction time

---

**Your platform is Web3-ready! Start with Phase 2 and build incrementally.** 🚀
