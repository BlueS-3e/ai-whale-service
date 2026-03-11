# 🚀 Production Readiness Checklist

**Status:** ⚠️ **NOT PRODUCTION READY** - Multiple hardcoded values need attention

---

## 🔴 **CRITICAL** - Must Fix Before Production

### 1. **Hardcoded Links in Frontend (Customer Dashboard Redirect)**

**Files:** All demo dashboard pages
- `apps/demo-dashboard/app/page.tsx` (2 occurrences)
- `apps/demo-dashboard/app/whale/page.tsx` (2 occurrences)
- `apps/demo-dashboard/app/sentiment/page.tsx` (2 occurrences)
- `apps/demo-dashboard/app/risk/page.tsx` (2 occurrences)

**Problem:**
```tsx
// Line 116 & 193 in each file:
<Link href="http://localhost:3001/pricing" target="_blank" rel="noopener noreferrer">
```

**Solution:** Replace with environment variable
```tsx
const CUSTOMER_DASHBOARD_URL = process.env.NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL || 'http://localhost:3001';

<Link href=`${CUSTOMER_DASHBOARD_URL}/pricing` target="_blank" rel="noopener noreferrer">
```

**Action Required:**
1. Add to `apps/demo-dashboard/.env.example`:
   ```bash
   NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL=http://localhost:3001
   ```
2. Add to production `.env`:
   ```bash
   NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL=https://your-customer-dashboard.vercel.app
   ```
3. Update all 8 hardcoded links across 4 files

---

### 2. **Hardcoded Demo API Key**

**File:** `apps/demo-dashboard/lib/api-client.ts`

**Problem:**
```typescript
const DEMO_API_KEY = 'supersecretkey'; // Line 4 - EXPOSED IN PUBLIC FRONTEND!
```

**Solution:**
```typescript
const DEMO_API_KEY = process.env.NEXT_PUBLIC_DEMO_API_KEY || 'demo_public_key';
```

**Security Risk:** ⚠️ Current key is visible in browser and could be abused

**Action Required:**
1. Generate a rate-limited demo key from backend
2. Store in environment variable
3. Configure backend to have special rate limits for demo keys

---

### 3. **Hardcoded Backend URLs in Documentation**

**File:** `apps/customer-dashboard/app/docs/page.tsx`

**Problem:**
```tsx
// Line 165:
curl -X POST http://localhost:8000/v1/whale/predict \\

// Line 347:
<a href="http://localhost:8000/docs" target="_blank">
```

**Solution:** Use environment variable
```tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

{`curl -X POST ${API_URL}/v1/whale/predict \\`}

<a href={`${API_URL}/docs`} target="_blank">
```

---

### 4. **Default Fallback URLs in API Clients**

**Files:**
- `apps/demo-dashboard/lib/api-client.ts` (Line 3)
- `apps/customer-dashboard/lib/api-client.ts` (Line 3)

**Current:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

**Production Risk:** If env var is missing, app will fail silently

**Solution:** Add validation
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}

// Or for dev-friendly approach:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? (() => { throw new Error('NEXT_PUBLIC_API_URL required in production') })() 
    : 'http://localhost:8000'
  );
```

---

### 5. **Vercel Deployment Placeholder URLs**

**Files:**
- `apps/demo-dashboard/vercel.json` (Line 11)
- `apps/customer-dashboard/vercel.json` (Line 11)

**Problem:**
```json
{
  "NEXT_PUBLIC_API_URL": {
    "value": "https://your-backend.up.railway.app"  // PLACEHOLDER!
  }
}
```

**Action Required:** Replace with actual production URLs before deploying to Vercel

---

### 6. **Hardcoded Payment URLs**

**File:** `app/api/v1/endpoints/payment.py`

**Problem:**
```python
# Lines 108-109:
success_url = request.success_url or "https://dashboard.yourapp.com/success"
cancel_url = request.cancel_url or "https://dashboard.yourapp.com/pricing"
```

**Solution:**
```python
from app.core.config import settings

success_url = request.success_url or f"{settings.FRONTEND_URL}/success"
cancel_url = request.cancel_url or f"{settings.FRONTEND_URL}/pricing"
```

Add to `.env`:
```bash
FRONTEND_URL=https://your-customer-dashboard.vercel.app
```

---

## 🟡 **HIGH PRIORITY** - Strongly Recommended

### 7. **Example Whale Wallet Addresses**

**File:** `apps/demo-dashboard/app/whale/page.tsx`

**Current:** Using potentially real wallet addresses (Lines 24-33)

**Recommendation:**
- Verify these are either:
  - Well-known public addresses (like exchange hot wallets)
  - Test addresses with no real funds
- Add comment explaining these are for demo purposes
- Consider rotating them periodically

---

### 8. **RPC Endpoint URLs**

**File:** `app/core/blockchain/rpc.py`

**Current:** Using free public RPC endpoints (Lines 28-32)
```python
'ethereum': os.getenv('ETHEREUM_RPC_URL', 'https://eth.llamarpc.com'),
'bsc': os.getenv('BSC_RPC_URL', 'https://bsc-dataseed.binance.org'),
'polygon': os.getenv('POLYGON_RPC_URL', 'https://polygon-rpc.com'),
```

**Production Risk:** 
- Rate limiting
- No guarantees on uptime
- Potential data inconsistency

**Recommendation:**
- Use paid RPC providers (Alchemy, Infura, QuickNode)
- Set up fallback endpoints
- Monitor RPC health

---

### 9. **CORS Origins Configuration**

**File:** `.env.backend.example`

**Problem:**
```bash
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","http://localhost:8000"]
```

**Action Required:** Update for production
```bash
CORS_ORIGINS=["https://demo.yourdomain.com","https://dashboard.yourdomain.com"]
```

---

### 10. **Stripe Webhook URLs**

**File:** `app/services/payment.py`

**Current:** Using placeholder Stripe URLs (Lines 177, 212)

**Action Required:** Configure actual webhook endpoint in Stripe dashboard
- URL: `https://your-api-domain.com/v1/payment/webhooks/stripe`
- Events to listen for: `checkout.session.completed`, `payment_intent.succeeded`

---

## 🟢 **MEDIUM PRIORITY** - Nice to Have

### 11. **Database Connection Strings**

**Files:** `.env.example`, `.env.backend.example`

**Current:**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/aiwhale
REDIS_URL=redis://localhost:6379/0
```

**Production:** Use secure managed databases with SSL
```bash
DATABASE_URL=postgresql://user:secure_pass@prod-db.cloud.provider/aiwhale?sslmode=require
REDIS_URL=rediss://prod-redis.cloud.provider:6380/0
```

---

### 12. **Secret Keys**

**Current:** Using placeholder/test keys in examples

**Production Checklist:**
- [ ] Generate strong `SECRET_KEY` (32+ random chars)
- [ ] Replace `STRIPE_SECRET_KEY` with production key
- [ ] Rotate `JWT_SECRET_KEY`
- [ ] Never commit real keys to git

---

### 13. **Analytics & Monitoring**

**Files:** `.env.example`, `.env.vercel.example`

**Currently commented out:**
```bash
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_SENTRY_DSN=
```

**Production Recommendation:**
- Add Google Analytics for usage tracking
- Set up Sentry for error monitoring
- Configure uptime monitoring (UptimeRobot, Pingdom)

---

### 14. **WalletConnect Project ID**

**Files:** Multiple frontend files

**Current:** Using placeholder `'PLACEHOLDER_PROJECT_ID'` or `'YOUR_PROJECT_ID'`

**Action Required:**
1. Create project at https://cloud.walletconnect.com/
2. Add to environment variables
3. Remove placeholder logic in production

---

## 📝 **TODO Comments** - Implementation Required

Found **50+ TODO comments** across the codebase indicating unfinished features:

**Critical TODOs:**
- `app/services/payment.py` - Multiple payment provider integrations incomplete
- `app/models/*.py` - ML models using mock data instead of trained models
- `app/services/blockchain.py` - Actual blockchain queries not implemented
- `app/core/security.py` - API key validation against database needed

**View all TODOs:**
```bash
grep -r "TODO" --include="*.py" --include="*.ts" --include="*.tsx" app/ apps/
```

---

## ✅ **Pre-Deployment Action Plan**

### Step 1: Update Environment Variables

Create production `.env` files:

**Backend (`/.env`):**
```bash
# Database
DATABASE_URL=postgresql://prod_user:prod_pass@prod-db/aiwhale?sslmode=require
REDIS_URL=rediss://prod-redis:6380/0

# Security
SECRET_KEY=<GENERATE_64_CHAR_RANDOM_STRING>
JWT_SECRET_KEY=<GENERATE_64_CHAR_RANDOM_STRING>

# CORS
CORS_ORIGINS=["https://demo.yourdomain.com","https://dashboard.yourdomain.com"]

# Blockchain
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# Payment
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_URL=https://dashboard.yourdomain.com

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
```

**Demo Dashboard (`/apps/demo-dashboard/.env.local`):**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL=https://dashboard.yourdomain.com
NEXT_PUBLIC_DEMO_API_KEY=<GENERATE_LIMITED_KEY>
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<YOUR_PROJECT_ID>
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

**Customer Dashboard (`/apps/customer-dashboard/.env.local`):**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<YOUR_PROJECT_ID>
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### Step 2: Code Changes Required

1. **Replace hardcoded localhost URLs** (8 files)
   ```bash
   # Demo dashboard pages - add env var for customer dashboard URL
   apps/demo-dashboard/app/page.tsx
   apps/demo-dashboard/app/whale/page.tsx
   apps/demo-dashboard/app/sentiment/page.tsx
   apps/demo-dashboard/app/risk/page.tsx
   ```

2. **Move demo API key to env var**
   ```bash
   apps/demo-dashboard/lib/api-client.ts
   ```

3. **Make backend URLs dynamic in docs**
   ```bash
   apps/customer-dashboard/app/docs/page.tsx
   ```

4. **Add payment URL configuration**
   ```bash
   app/api/v1/endpoints/payment.py
   app/core/config.py  # Add FRONTEND_URL setting
   ```

5. **Update vercel.json with real URLs**
   ```bash
   apps/demo-dashboard/vercel.json
   apps/customer-dashboard/vercel.json
   ```

### Step 3: External Services Setup

- [ ] **Vercel:** Deploy both dashboards
- [ ] **Railway:** Deploy backend API
- [ ] **Database:** Provision PostgreSQL (Railway/Supabase/RDS)
- [ ] **Redis:** Provision Redis instance
- [ ] **Stripe:** Configure webhooks + production keys
- [ ] **WalletConnect:** Create project
- [ ] **RPC Providers:** Sign up for Alchemy/Infura
- [ ] **Monitoring:** Set up Sentry
- [ ] **Analytics:** Configure Google Analytics

### Step 4: Security Audit

- [ ] Scan for exposed secrets: `git secrets --scan`
- [ ] Review CORS configuration
- [ ] Enable rate limiting on backend
- [ ] Set up SSL certificates (should be automatic with Vercel/Railway)
- [ ] Configure database SSL connections
- [ ] Review API key permissions

### Step 5: Testing

- [ ] Test all API endpoints with production URLs
- [ ] Verify payment flow end-to-end
- [ ] Test Web3 wallet connections
- [ ] Check mobile responsiveness
- [ ] Load test API endpoints
- [ ] Verify error monitoring captures issues

---

## 🔍 **How to Find Remaining Issues**

```bash
# Find all localhost references
grep -r "localhost" --include="*.ts" --include="*.tsx" --include="*.py" apps/ app/

# Find hardcoded URLs
grep -r "http://" --include="*.ts" --include="*.tsx" --include="*.py" apps/ app/ | grep -v "https://"

# Find remaining TODOs
grep -r "TODO\|FIXME\|HACK" --include="*.ts" --include="*.tsx" --include="*.py" apps/ app/

# Find potential secrets
grep -r "supersecret\|password\|secret" --include="*.ts" --include="*.tsx" --include="*.py" apps/ app/
```

---

## 📋 **Summary**

| Category | Count | Priority |
|----------|-------|----------|
| **Hardcoded localhost URLs** | 8 locations | 🔴 Critical |
| **Demo API key exposure** | 1 location | 🔴 Critical |
| **Placeholder payment URLs** | 2 locations | 🔴 Critical |
| **Vercel placeholder URLs** | 2 files | 🔴 Critical |
| **TODO comments** | 50+ | 🟡 High |
| **RPC endpoint upgrades** | 5 chains | 🟡 High |
| **Missing monitoring** | Multiple | 🟢 Medium |

**Estimated Time to Production Ready:** 4-6 hours

---

## 🎯 **Quick Fix Script**

Run this to prepare for immediate deployment:

```bash
#!/bin/bash

echo "🔍 Checking for hardcoded localhost URLs..."
grep -r "localhost" apps/ --include="*.tsx" | wc -l

echo "🔍 Checking for TODOs..."
grep -r "TODO" app/ apps/ --include="*.py" --include="*.ts" --include="*.tsx" | wc -l

echo ""
echo "⚠️  Please review PRODUCTION_CHECKLIST.md before deploying!"
echo ""
echo "Required env vars:"
echo "  - NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL"
echo "  - NEXT_PUBLIC_DEMO_API_KEY"
echo "  - NEXT_PUBLIC_API_URL (production)"
echo "  - DATABASE_URL (production)"
echo "  - REDIS_URL (production)"
echo "  - STRIPE_SECRET_KEY (live)"
echo "  - FRONTEND_URL"
echo ""
```

---

**Last Updated:** $(date)
**Review Status:** ⚠️ Needs Review Before Production
**Next Action:** Complete Step 2 code changes, then test in staging environment
