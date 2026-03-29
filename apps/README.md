# 🚀 BNB Whale AI - Frontend Setup

Complete setup guide for the customer dashboard and demo dashboard.

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Your backend API running on `http://localhost:8000`
- (Optional) WalletConnect Project ID for Web3 features

## 🏗️ Project Structure

```
apps/
├── customer-dashboard/    # B2B dashboard for API customers
│   ├── app/               # Next.js 15 App Router
│   ├── components/        # React components
│   ├── lib/               # Utilities and API client
│   └── hooks/             # Custom React hooks
│
└── demo-dashboard/        # Public demo for showcasing features
    ├── app/               # Next.js 15 App Router
    ├── components/        # React components (includes Web3)
    ├── lib/               # Utilities, API client, Web3 config
    └── hooks/             # Custom hooks (includes useWeb3)
```

## 🚀 Quick Start

### 1. Install Dependencies

**Customer Dashboard:**
```bash
cd apps/customer-dashboard
npm install
```

**Demo Dashboard:**
```bash
cd apps/demo-dashboard
npm install
```

### 2. Environment Setup

**Customer Dashboard** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Demo Dashboard** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: Custom RPC endpoints
NEXT_PUBLIC_ETHEREUM_RPC=https://eth.llamarpc.com
NEXT_PUBLIC_POLYGON_RPC=https://polygon-rpc.com
```

**Get WalletConnect Project ID:**
1. Visit https://cloud.walletconnect.com/
2. Create a free account
3. Create a new project
4. Copy your Project ID

### 3. Start Development Servers

**Customer Dashboard** (runs on `http://localhost:3001`):
```bash
cd apps/customer-dashboard
npm run dev
```

**Demo Dashboard** (runs on `http://localhost:3000`):
```bash
cd apps/demo-dashboard
npm run dev
```

## 🔧 Features

### Customer Dashboard (Port 3001)

**Purpose:** Control panel for API customers

**Pages:**
- `/` - Home dashboard with quick navigation
- `/api-keys` - Generate and manage API keys
- `/usage` - View usage analytics and billing
- `/playground` - Test API endpoints interactively
- `/docs` - Complete API documentation

**Key Features:**
- API key management (create, revoke, copy)
- Usage tracking with charts (Recharts)
- Interactive API playground
- Real-time API testing
- Documentation browser

### Demo Dashboard (Port 3000)

**Purpose:** Public demo showcasing AI capabilities

**Pages:**
- `/` - Landing page with feature overview
- `/whale` - Whale movement prediction demo
- `/sentiment` - Sentiment analysis demo
- `/risk` - Risk assessment demo

**Key Features:**
- Live AI predictions
- Interactive data visualization
- Web3 wallet connection (RainbowKit)
- Multi-chain support (Ethereum, Polygon, Base, etc.)
- Real-time blockchain data
- Animated sentiment gauges
- Risk scoring breakdown

## 🔗 Web3 Integration

The demo dashboard includes full Web3 functionality:

### Wallet Connection

```tsx
import { WalletConnect } from '@/components/wallet-connect';

// Use in any page
<WalletConnect />
```

Supports:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- And 100+ more via RainbowKit

### Blockchain Hooks

```tsx
import { useAccount, useBalance } from 'wagmi';
import { useWhaleTransactions, useChainData } from '@/hooks/useWeb3';

function MyComponent() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { transactions } = useWhaleTransactions(address);
  const { chain, blockNumber, gasPrice } = useChainData();
  
  // Your component logic
}
```

### Supported Chains

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base
- Sepolia (testnet)

## 📦 Tech Stack

### Core
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

### Web3 (Demo Dashboard)
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **@solana/web3.js** - Solana support (future)

### Data & State
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Recharts** - Data visualization

### UI/UX
- **Lucide React** - Icon library
- **Radix UI** - Accessible primitives
- **Framer Motion** - Animations (demo dashboard)

## 🎨 Customization

### Styling

Both dashboards use Tailwind CSS. Edit the theme in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: "your-color",
      // ... more colors
    }
  }
}
```

### API Client

Edit `/lib/api-client.ts` to add new endpoints:

```ts
export const myNewApi = {
  getData: async (params: any) => {
    const response = await apiClient.get('/v1/my-endpoint', { params });
    return response.data;
  },
};
```

### Adding Pages

Next.js 15 App Router makes it easy:

1. Create `app/my-page/page.tsx`
2. Export a default component
3. Automatic routing at `/my-page`

## 🐛 Troubleshooting

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

### Wallet Not Connecting

1. Check WalletConnect Project ID in `.env.local`
2. Make sure you're on a supported network
3. Try clearing browser cache
4. Check browser console for errors

### API Calls Failing

1. Verify backend is running: `curl http://localhost:8000/v1/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Verify API key in requests

## 🚢 Production Deployment

### Build for Production

```bash
# Customer Dashboard
cd apps/customer-dashboard
npm run build
npm run start

# Demo Dashboard
cd apps/demo-dashboard
npm run build
npm run start
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `apps/customer-dashboard` or `apps/demo-dashboard`
4. Add environment variables
5. Deploy!

### Environment Variables for Production

```env
# Required
NEXT_PUBLIC_API_URL=https://your-production-api.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)
- [Viem](https://viem.sh/)

## 🤝 Contributing

1. Make sure both backends and frontends work locally
2. Test wallet connection features
3. Check responsiveness on mobile
4. Run type checking: `npm run build`

## 📝 License

MIT License - See LICENSE file for details

---

**Need Help?** Check the main README.md or open an issue!
