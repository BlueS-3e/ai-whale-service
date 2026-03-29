# 🚀 Complete Setup Guide - BNB Whale AI with Web3

This guide will get your entire platform running in **under 10 minutes**!

## 📋 What You're Building

- **Backend API** (FastAPI) - AI models + blockchain data
- **Customer Dashboard** (Next.js) - B2B API management portal
- **Demo Dashboard** (Next.js) - Public-facing AI demos with Web3 wallet

## 🛠️ Prerequisites

- **Node.js 18+** and npm
- **Python 3.9+** and pip
- **Redis** (optional for caching)
- **PostgreSQL** (optional for production)

---

## 🏃 Quick Start (3 Steps)

### Step 1: Backend Setup (2 minutes)

```bash
# Install Python dependencies
pip install -r requirements.txt
pip install -r requirements.web3.txt

# Create and configure environment
cp .env.backend.example .env
# Edit .env and set your RPC URLs (or use the free defaults)

# Start the backend
uvicorn app.main:app --reload --port 8000
```

**Backend will be at**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

### Step 2: Customer Dashboard (2 minutes)

```bash
cd apps/customer-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local - set API_URL to http://localhost:8000

# Start the dashboard
npm run dev
```

**Customer Dashboard**: http://localhost:3001

### Step 3: Demo Dashboard (3 minutes)

```bash
cd apps/demo-dashboard

# Install dependencies
npm install

# Get WalletConnect Project ID
# 1. Go to https://cloud.walletconnect.com/
# 2. Sign up (free)
# 3. Create a project
# 4. Copy the Project ID

# Configure environment
cp .env.example .env.local
# Edit .env.local:
#   - NEXT_PUBLIC_API_URL=http://localhost:8000
#   - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Start the dashboard
npm run dev
```

**Demo Dashboard**: http://localhost:3000

---

## ✅ Verify Everything Works

### 1. Backend Health Check

```bash
# Check main API
curl http://localhost:8000/v1/health

# Check Web3 integration
curl http://localhost:8000/v1/web3/health

# Should see connected chains and block numbers
```

### 2. Customer Dashboard

1. Go to http://localhost:3001
2. Click "API Keys" - see mock data
3. Click "Playground" - test whale prediction
4. Click "Usage" - see analytics charts
5. Click "Docs" - view API documentation

### 3. Demo Dashboard

1. Go to http://localhost:3000
2. Click "Connect Wallet" (top right)
3. Connect MetaMask or any wallet
4. Try the demos:
   - **Whale Tracker** - Predict whale movements
   - **Sentiment** - Analyze crypto sentiment
   - **Risk Assessment** - Multi-factor risk scoring

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Import errors for web3, websockets  
**Solution**: `pip install -r requirements.web3.txt`

**Problem**: Connection refused on RPC URLs  
**Solution**: Check .env file has valid RPC URLs. Use free defaults:
```bash
ETHEREUM_RPC_URL=https://eth.llamarpc.com
POLYGON_RPC_URL=https://polygon-rpc.com
```

### Frontend Issues

**Problem**: Module not found errors  
**Solution**: Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Wallet connection fails  
**Solution**: 
1. Make sure NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is set in .env.local
2. Get a free project ID from https://cloud.walletconnect.com/
3. Restart dev server after changing .env.local

**Problem**: API calls fail with CORS  
**Solution**: Add frontend URLs to backend .env:
```bash
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
```

---

## 🌐 Getting Free RPC Access

### Option 1: Public Endpoints (Free, No Signup)

Already configured in `.env.backend.example`:
- Ethereum: https://eth.llamarpc.com
- Polygon: https://polygon-rpc.com
- Base: https://mainnet.base.org
- Arbitrum: https://arb1.arbitrum.io/rpc

**Limits**: Rate limited, slower, less reliable

### Option 2: LlamaNodes (Free Tier)

1. Go to https://llamanodes.com/
2. Sign up (free)
3. Get API keys for multiple chains
4. Update .env with your endpoints

**Free Tier**: 
- 300K requests/month
- 10 requests/second
- 50+ chains

### Option 3: Alchemy (Best for Production)

1. Go to https://www.alchemy.com/
2. Sign up (free tier available)
3. Create an app
4. Get your API key

**Free Tier**:
- 300M compute units/month
- Support for Ethereum, Polygon, Arbitrum, Optimism, Base
- WebSocket support
- Enhanced APIs

Update .env:
```bash
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ETHEREUM_WS_URL=wss://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### Option 4: Infura

1. Go to https://infura.io/
2. Sign up (free tier available)
3. Create a project
4. Get your API keys

**Free Tier**:
- 100K requests/day
- Multiple networks

---

## 📦 What's Included

### Backend Features ✅

- **AI Models**
  - Whale movement prediction
  - Sentiment analysis
  - Risk assessment
  
- **Blockchain Integration**
  - Multi-chain RPC (Ethereum, Polygon, Arbitrum, Base, BSC)
  - WebSocket monitoring
  - Wallet balance queries
  - Transaction lookups
  - Whale transaction scanning
  - ERC20 token balances
  
- **Authentication**
  - API key management
  - Sign-In with Ethereum (SIWE)
  
- **API Documentation**
  - OpenAPI/Swagger UI
  - Interactive testing

### Customer Dashboard Features ✅

- **API Key Management** - Create, view, delete API keys
- **Usage Analytics** - Track calls, costs, trends (Recharts)
- **Interactive Playground** - Test all endpoints live
- **Documentation** - Complete API reference
- **Responsive Design** - Works on all devices

### Demo Dashboard Features ✅

- **Whale Tracker** - Predict whale wallet actions
- **Sentiment Analyzer** - Analyze crypto text sentiment
- **Risk Assessment** - 5-factor risk scoring
- **Web3 Wallet** - Connect MetaMask, WalletConnect, etc.
- **Multi-Chain Support** - Switch between 6 blockchains
- **Real-time Data** - Live blockchain queries
- **Beautiful UI** - Gradients, animations, gauges

---

## 🚀 Next Steps

### For Development

1. **Test with Real Wallets**
   ```bash
   # Use Sepolia testnet (free test ETH)
   # Get test ETH: https://sepoliafaucet.com/
   ```

2. **Integrate Real AI Models**
   - Replace mock predictions in `app/services/*_service.py`
   - Train models with historical data
   - Add model versioning

3. **Add Database**
   - Set up PostgreSQL
   - Run migrations: `alembic upgrade head`
   - Store API keys, usage stats

4. **Add More Features**
   - Webhook notifications
   - NFT gating (token-based access)
   - Crypto payments
   - Mobile app (React Native)
   - Advanced charts
   - More blockchains (Solana, Avalanche, Cosmos)

### For Production

1. **Deploy Backend**
   ```bash
   # Option 1: Railway.app (easiest)
   # Option 2: Render.com
   # Option 3: AWS/GCP/Azure
   
   # Set production environment variables
   # Enable rate limiting
   # Set up monitoring (Sentry)
   ```

2. **Deploy Frontends**
   ```bash
   # Vercel (recommended for Next.js)
   cd apps/customer-dashboard
   vercel deploy
   
   cd apps/demo-dashboard
   vercel deploy
   
   # Or Netlify, CloudFlare Pages
   ```

3. **Get Production RPC**
   - Upgrade to Alchemy Growth ($49/month)
   - Or use multiple free tiers
   - Add Redis caching for blockchain calls

4. **Secure Your App**
   - Use strong SECRET_KEY in .env
   - Enable HTTPS (automatic with Vercel)
   - Add rate limiting to API
   - Validate all inputs
   - Monitor for anomalies

---

## 📚 Documentation

- **[Frontend README](apps/README.md)** - Detailed frontend guide
- **[Web3 Setup](WEB3_SETUP.md)** - Blockchain integration details

---

## 💡 Pro Tips

1. **Start Simple**: Use public RPC endpoints initially, upgrade when needed
2. **Test on Sepolia**: Free testnet for Ethereum testing
3. **Monitor Backend**: Check `/v1/web3/health` regularly
4. **Cache Blockchain Calls**: Use Redis to reduce RPC usage
5. **Wallet Testing**: Use MetaMask's test networks
6. **Keep Dependencies Updated**: `npm update`, `pip list --outdated`

---

## 🎉 You're Ready!

You now have a production-ready AI + Web3 platform with:
- ✅ AI prediction models
- ✅ Multi-chain blockchain integration
- ✅ Professional B2B dashboard
- ✅ Public demo dashboard
- ✅ Wallet connection (100+ wallets)
- ✅ Real-time blockchain data
- ✅ API documentation
- ✅ Responsive design
- ✅ Type safety (TypeScript)

**Start building the future of AI + blockchain! 🚀**

---

## 🆘 Need Help?

Common issues:
- **Port already in use**: Change ports in package.json (dev scripts)
- **Can't connect wallet**: Verify WalletConnect Project ID
- **RPC errors**: Check .env blockchain URLs
- **TypeScript errors**: Run `npm install` again
- **Backend not starting**: Check Python dependencies installed

For more help, check the troubleshooting sections in:
- [apps/README.md](apps/README.md)
- [WEB3_SETUP.md](WEB3_SETUP.md)
