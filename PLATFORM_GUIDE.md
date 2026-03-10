# 🚀 AI Whale Service - Complete Platform Guide

## Overview

You now have a complete AI-as-a-Service platform with:
- ✅ FastAPI backend with 3 AI models (whale prediction, sentiment analysis, risk assessment)
- ✅ Demo Dashboard (public showcase at port 3000)
- ✅ Customer Dashboard (B2B portal at port 3001)
- ✅ Web3 integration ready (wallet connection, multi-chain support)

---

## 🏃 Quick Start (One Command)

```bash
./START_ALL.sh
```

This starts:
- Backend API on **http://localhost:8000**
- Demo Dashboard on **http://localhost:3000**
- Customer Dashboard on **http://localhost:3001**

To stop everything:
```bash
./STOP_ALL.sh
```

---

## 📚 Manual Setup

### 1. Backend API

```bash
# Activate virtual environment
source venv/bin/activate

# Start API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Endpoints:**
- Health: http://localhost:8000/v1/health
- Docs: http://localhost:8000/docs
- API Key: `supersecretkey` (for testing)

### 2. Demo Dashboard

```bash
cd apps/demo-dashboard

# First time only
npm install

# Start development server
npm run dev
```

**Features:**
- 🐋 Whale Movement Tracker - Real-time AI predictions
- 💭 Sentiment Analyzer - Social media sentiment with gauges
- ⚠️ Risk Assessment - Multi-factor risk scoring
- 🔗 Wallet Connect - Web3 integration

**URL:** http://localhost:3000

### 3. Customer Dashboard

```bash
cd apps/customer-dashboard

# First time only
npm install

# Start development server
npm run dev
```

**Features:**
- 🔑 API Key Management - Generate and manage keys
- 📊 Usage Analytics - Track API calls and billing
- 🎮 Playground - Test all endpoints interactively
- 📚 Documentation - Complete API reference

**URL:** http://localhost:3001

---

## 🧪 Testing the Platform

### Test Backend API

```bash
# Health check
curl http://localhost:8000/v1/health

# Whale prediction
curl -X POST http://localhost:8000/v1/whale/predict \
  -H "X-API-Key: supersecretkey" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "coin_symbol": "BTC",
    "timeframe": "24h"
  }'

# Sentiment analysis
curl -X POST http://localhost:8000/v1/sentiment/analyze \
  -H "X-API-Key: supersecretkey" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bitcoin is going to the moon! 🚀",
    "coin_symbol": "BTC"
  }'

# Risk assessment
curl -X POST http://localhost:8000/v1/risk/assess \
  -H "X-API-Key: supersecretkey" \
  -H "Content-Type: application/json" \
  -d '{
    "coin_symbol": "DOGE",
    "chain": "ethereum"
  }'
```

### Test Frontend Dashboards

1. **Demo Dashboard** (http://localhost:3000)
   - Click "Try Live Demo" on homepage
   - Go to Whale Tracker
   - Enter wallet address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Select coin: BTC
   - Click "Predict Movement"

2. **Customer Dashboard** (http://localhost:3001)
   - Go to Playground
   - Test whale prediction, sentiment, or risk endpoints
   - View real-time API responses

---

## 🌐 Web3 Features

### Wallet Connection (Demo Dashboard)

The demo dashboard includes Web3 wallet integration:

```typescript
// Automatically detects MetaMask/WalletConnect
// Supports: Ethereum, BSC, Polygon, Base, Arbitrum, Optimism
```

**To test:**
1. Install MetaMask browser extension
2. Visit http://localhost:3000
3. Click "Connect Wallet" button
4. Your wallet address and chain will display

### Supported Chains

| Chain | Chain ID | RPC URL |
|-------|----------|---------|
| Ethereum | 1 | https://eth.llamarpc.com |
| BSC | 56 | https://bsc-dataseed.binance.org |
| Polygon | 137 | https://polygon-rpc.com |
| Base | 8453 | https://mainnet.base.org |
| Arbitrum | 42161 | https://arb1.arbitrum.io/rpc |
| Optimism | 10 | https://mainnet.optimism.io |

---

## 📂 Project Structure

```
Model.1/
├── app/                           # FastAPI Backend
│   ├── api/v1/endpoints/         # API routes
│   │   ├── whale.py              # Whale prediction
│   │   ├── sentiment.py          # Sentiment analysis
│   │   └── risk.py               # Risk assessment
│   ├── models/                   # AI models
│   │   ├── whale_predictor.py
│   │   ├── sentiment_analyzer.py
│   │   └── risk_scorer.py
│   └── services/                 # Business logic
│
├── apps/                         # Frontend Apps
│   ├── demo-dashboard/          # Public demo (port 3000)
│   │   ├── app/                 # Next.js pages
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks (useWeb3)
│   │   └── lib/                 # API client, Web3 config
│   │
│   └── customer-dashboard/      # B2B portal (port 3001)
│       ├── app/                 # Next.js pages
│       ├── components/          # React components
│       └── lib/                 # API client
│
├── logs/                        # Application logs
├── START_ALL.sh                 # Start everything
├── STOP_ALL.sh                  # Stop everything
└── requirements.txt             # Python dependencies
```

---

## 🎯 Next Steps

### Phase 1: Integrate Real AI Models

Currently using dummy models. Replace with real implementations:

**Whale Predictor:**
```python
# app/models/whale_predictor.py
import joblib
self.model = joblib.load("models/whale_model.pkl")
```

**Sentiment Analyzer:**
```python
from transformers import pipeline
self.model = pipeline("sentiment-analysis", model="finbert")
```

### Phase 2: Add Blockchain Data

**Ethereum RPC:**
```python
from web3 import Web3
w3 = Web3(Web3.HTTPProvider("https://eth.llamarpc.com"))
balance = w3.eth.get_balance(wallet_address)
```

**Transaction Monitoring:**
```python
# Real-time WebSocket connections
import asyncio
from web3 import Web3

async def monitor_whale_wallet(address):
    # Subscribe to new blocks and filter transactions
    pass
```

### Phase 3: Advanced Web3 Features

1. **NFT-Gated Access** - Premium features for NFT holders
2. **Crypto Payments** - Accept USDC for subscriptions
3. **On-Chain Verification** - Store predictions on-chain
4. **DAO Integration** - Whale alerts for DAO treasuries

### Phase 4: Production Deployment

**Backend:**
- Deploy to Railway, Render, or AWS
- Add PostgreSQL and Redis
- Configure environment variables

**Frontend:**
- Deploy to Vercel (recommended)
- Set `NEXT_PUBLIC_API_URL` to production API
- Add custom domain

---

## 🔧 Configuration

### Backend Environment Variables

Edit `.env` file:
```env
# API Settings
API_TITLE=AI Whale Service
API_VERSION=1.0.0
ENVIRONMENT=development

# Database (when ready)
DATABASE_URL=postgresql://user:password@localhost:5432/aiwhale

# Redis (when ready)
REDIS_URL=redis://localhost:6379/0

# API Keys
MASTER_API_KEY=your-secret-key-here

# Web3 RPC (for real blockchain data)
ETHEREUM_RPC_URL=https://eth.llamarpc.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Frontend Environment Variables

**Demo Dashboard** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ETHEREUM_RPC=https://eth.llamarpc.com
NEXT_PUBLIC_BSC_RPC=https://bsc-dataseed.binance.org
```

**Customer Dashboard** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (demo)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (customer)
lsof -ti:3001 | xargs kill -9
```

### API Connection Failed

1. Check backend is running: `curl http://localhost:8000/v1/health`
2. Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Check for CORS errors in browser console

### Module Not Found Errors

**Backend:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd apps/demo-dashboard  # or customer-dashboard
npm install
```

### Web3 Wallet Issues

1. Install MetaMask or another Web3 wallet
2. Refresh page after installation
3. Check browser console for errors
4. Ensure you're on a supported chain

---

## 📖 Documentation

- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **Frontend README:** [apps/README.md](apps/README.md)
- **Backend Setup:** [QUICKSTART.md](QUICKSTART.md)

---

## 🎨 Customization

### Change Colors

**Demo Dashboard** (`apps/demo-dashboard/tailwind.config.ts`):
```typescript
colors: {
  primary: "hsl(221.2 83.2% 53.3%)", // Blue
  // Change to your brand color
}
```

### Add New Endpoint

1. Create route in `app/api/v1/endpoints/`
2. Add schema in `app/schemas/`
3. Implement service in `app/services/`
4. Add frontend component in `apps/*/app/`

---

## 📊 Features Checklist

### Backend ✅
- [x] FastAPI with automatic docs
- [x] Whale movement prediction endpoint
- [x] Sentiment analysis endpoint
- [x] Risk assessment endpoint
- [x] API key authentication
- [x] CORS enabled
- [ ] Real AI models (currently dummy)
- [ ] Database integration
- [ ] Redis caching
- [ ] Celery background tasks

### Demo Dashboard ✅
- [x] Landing page with features
- [x] Whale tracker with live predictions
- [x] Sentiment analyzer with gauges
- [x] Risk assessment with scoring
- [x] Web3 wallet connection
- [x] Responsive design
- [ ] Real-time WebSocket feeds
- [ ] Portfolio tracker

### Customer Dashboard ✅
- [x] API key management UI
- [x] Usage analytics display
- [x] Interactive playground
- [x] API documentation
- [ ] Real usage tracking
- [ ] Billing integration
- [ ] Team management

### Web3 Integration 🔄
- [x] Wallet connection component
- [x] Multi-chain support config
- [x] Chain switching
- [ ] Real RPC integration
- [ ] NFT gating
- [ ] Crypto payments
- [ ] On-chain verification

---

## 🚀 Launch Checklist

Before going live:

**Backend:**
- [ ] Replace dummy models with real AI
- [ ] Set up production database
- [ ] Configure Redis caching
- [ ] Add rate limiting
- [ ] Enable logging and monitoring
- [ ] Set secure API keys

**Frontend:**
- [ ] Deploy to Vercel or Netlify
- [ ] Configure production API URL
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Set up error tracking (Sentry)
- [ ] Optimize images and bundles
- [ ] Add SEO meta tags

**Security:**
- [ ] HTTPS everywhere
- [ ] Secure API keys in environment
- [ ] Rate limit API endpoints
- [ ] Validate all inputs
- [ ] Add CAPTCHA if needed
- [ ] Review CORS settings

---

## 💡 Pro Tips

1. **Start with demo dashboard** - It's the best sales tool
2. **Test endpoints in Swagger** - http://localhost:8000/docs
3. **Use playground** - Customer dashboard has interactive testing
4. **Monitor logs** - Check `logs/` directory
5. **Incremental deployment** - Deploy backend first, then frontends

---

## 📞 Support

- **API Issues:** Check `logs/api.log`
- **Frontend Issues:** Check browser console
- **Web3 Issues:** Check wallet extension
- **General:** Review this guide and `apps/README.md`

---

**Built with ❤️ for the crypto community**

🐋 Track whales • 💭 Analyze sentiment • ⚠️ Assess risks • 🔗 Powered by Web3
