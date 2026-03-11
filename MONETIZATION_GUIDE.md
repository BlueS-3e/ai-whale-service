# 💳 Monetization Implementation Guide

**AI Whale Service - Dual Payment System (Stripe + Crypto)**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Implementation Status](#implementation-status)
4. [Quick Start](#quick-start)
5. [Payment Methods](#payment-methods)
6. [Integration Steps](#integration-steps)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Analytics & Monitoring](#analytics-monitoring)

---

## 🎯 Overview

**Your monetization strategy implements a modern dual-payment system:**

- ✅ **Stripe (Fiat)**: Credit cards, Apple Pay, Google Pay + Crypto.com integration
- ✅ **Native Crypto**: INXY, PayRam, Binance Pay for direct stablecoin payments
- ✅ **10% discount** for annual crypto payments
- ✅ **Zero chargebacks** with blockchain payments
- ✅ **Multi-chain support**: Ethereum, Polygon, Base, BSC, Bitcoin

### Pricing Tiers

| Tier | Monthly | Yearly | Calls/Month | Rate Limit |
|------|---------|--------|-------------|------------|
| **Demo** | $0 | N/A | 100 | 10/min |
| **Starter** | $49 | $470 | 10,000 | 60/min |
| **Growth** | $199 | $1,910 | 100,000 | 300/min |
| **Enterprise** | $999 | $9,590 | 1,000,000 | 1000/min |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Customer Dashboard                      │
│              (dashboard.yourapp.com)                     │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┼──────────┬──────────┐
        ▼           ▼          ▼          ▼
    ┌────────┐  ┌────────┐  ┌──────┐  ┌─────────┐
    │ Stripe │  │ INXY   │  │PayRam│  │Binance  │
    │ (Card  │  │(Native │  │(Self │  │Pay      │
    │ + Crypto│  │Crypto) │  │Hosted│  │(45M+    │
    │.com)   │  │        │  │)     │  │users)   │
    └────┬───┘  └───┬────┘  └──┬───┘  └────┬────┘
         │          │           │           │
         └──────────┴───────────┴───────────┘
                    │
         ┌──────────▼──────────┐
         │  Your Bank Account  │
         │  (Auto-converted to │
         │  fiat if desired)   │
         └─────────────────────┘
```

### Components Implemented

✅ **Backend (FastAPI)**:
- `app/core/pricing.py` - Pricing tiers & endpoint costs
- `app/core/security.py` - Redis-based rate limiting
- `app/services/billing.py` - Usage tracking & quota management
- `app/services/payment.py` - Multi-provider payment processing
- `app/api/v1/endpoints/payment.py` - Payment API endpoints
- `app/models/db/user.py` - Database models (User, APIKey, Subscription, Payment)

✅ **Database Models**:
- User accounts (email + wallet address support)
- API keys with rate limits
- Subscriptions with provider tracking
- Payments with crypto tx hash support
- Usage logs for analytics

✅ **Redis Integration**:
- Rate limiting (per-minute + per-day)
- Usage tracking (real-time counters)
- Session management

---

## 📊 Implementation Status

### ✅ Completed

- [x] Pricing tier configuration (4 tiers: Demo → Enterprise)
- [x] Endpoint cost mapping (different API calls cost different units)
- [x] Redis-based rate limiting (sliding window)
- [x] Usage tracking (per-endpoint, daily, monthly aggregates)
- [x] Quota management with overage calculation
- [x] Payment service architecture (Stripe + 4 crypto providers)
- [x] Webhook handlers (Stripe, INXY, PayRam, Binance)
- [x] Database models (SQLAlchemy ORM)
- [x] Payment API endpoints

### 🔧 TODO (Next Steps)

- [ ] **Week 1: Stripe Integration**
  - [ ] Install Stripe SDK: `pip install stripe`
  - [ ] Set environment variable: `STRIPE_SECRET_KEY`
  - [ ] Implement actual Stripe Checkout session creation
  - [ ] Test with Stripe test cards
  - [ ] Verify webhooks with `stripe listen`

- [ ] **Week 2: Database Setup**
  - [ ] Run migrations: `alembic init alembic` (or use manual `init_db()`)
  - [ ] Create database tables: Call `init_db()` on startup
  - [ ] Add API key generation endpoint
  - [ ] Implement user registration flow

- [ ] **Week 3: Crypto Payments**
  - [ ] Choose primary crypto provider (INXY or PayRam recommended)
  - [ ] Integrate chosen provider's API
  - [ ] Test with testnet stablecoins
  - [ ] Add wallet connection to customer dashboard

- [ ] **Week 4: Customer Dashboard UI**
  - [ ] Payment selection page (Card vs Crypto)
  - [ ] Checkout flow (redirect to payment provider)
  - [ ] Success/failure pages
  - [ ] Usage analytics dashboard
  - [ ] API key management UI

- [ ] **Week 5: Email & Notifications**
  - [ ] SendGrid/Mailgun integration
  - [ ] Welcome email on signup
  - [ ] Payment receipt emails
  - [ ] Quota warning emails (80%, 90%, 100%)
  - [ ] Upgrade prompts

- [ ] **Week 6: Analytics & Monitoring**
  - [ ] Revenue dashboard (daily, monthly, by tier)
  - [ ] Conversion funnel metrics (demo → paid)
  - [ ] Churn analysis
  - [ ] Usage patterns by tier

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Core payment dependencies
pip install stripe==7.0.0
pip install redis[hiredis]

# Optional crypto provider SDKs
pip install inxy-api  # If using INXY
# PayRam is self-hosted, no SDK needed
# Binance Pay SDK (if using)
```

### 2. Environment Variables

Add to `.env`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...  # Get from https://dashboard.stripe.com/apikeys
STRIPE_WEBHOOK_SECRET=whsec_...  # Get after creating webhook endpoint

# INXY (if using)
INXY_API_KEY=your_inxy_api_key
INXY_WEBHOOK_SECRET=your_webhook_secret

# PayRam (if using)
PAYRAM_WALLET_ADDRESS=0x...  # Your receiving wallet

# Binance Pay (if using)
BINANCE_PAY_API_KEY=your_api_key
BINANCE_PAY_API_SECRET=your_api_secret
BINANCE_PAY_CERTIFICATE=your_certificate

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aiwhale

# Redis (for rate limiting & caching)
REDIS_URL=redis://localhost:6379/0
```

### 3. Initialize Database

```python
from app.core.database import init_db

# Run once to create tables
init_db()
```

### 4. Test Locally

```bash
# Start Redis
redis-server

# Start FastAPI server
uvicorn app.main:app --reload

# Visit API docs
open http://localhost:8000/docs
```

---

## 💳 Payment Methods

### 1. Stripe (Default - Easiest)

**Pros:**
- ✅ Mainstream users trust it
- ✅ Built-in crypto support (via Crypto.com)
- ✅ Subscription management
- ✅ Automatic invoicing
- ✅ 150M+ existing users

**Implementation:**
```python
import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

session = stripe.checkout.Session.create(
    customer_email=user_email,
    mode='subscription',
    payment_method_types=['card', 'crypto'],  # Enable crypto!
    line_items=[{...}],
    success_url='https://dashboard.yourapp.com/success',
    cancel_url='https://dashboard.yourapp.com/pricing',
)
```

**Setup Steps:**
1. Create Stripe account: https://dashboard.stripe.com/register
2. Get API keys from Dashboard → API Keys
3. Create webhook endpoint: Dashboard → Webhooks
4. Enable Crypto.com Pay: Dashboard → Settings → Payment Methods

### 2. INXY Paygate (Native Crypto - EU Compliant)

**Pros:**
- ✅ Auto-conversion to fiat
- ✅ WHMCS plugin (if needed)
- ✅ Zero chargebacks
- ✅ Multi-chain support

**Implementation:**
```python
import httpx

response = await httpx.post(
    "https://api.inxy.com/v1/payments",
    headers={"Authorization": f"Bearer {INXY_API_KEY}"},
    json={
        "amount": 49.00,
        "currency": "USD",
        "customer_email": user_email,
        "auto_convert": True,  # Convert to fiat
        "accepted_tokens": ["USDC", "USDT", "ETH"],
    }
)
```

### 3. PayRam (Self-Hosted)

**Pros:**
- ✅ No KYC required
- ✅ Multi-chain (Ethereum, Polygon, Base, Tron, Bitcoin)
- ✅ MCP server for AI agents
- ✅ Full control of funds

**Note:** Requires your own server and wallet management.

### 4. Binance Pay (Massive Network)

**Pros:**
- ✅ 45M+ users
- ✅ $250B+ processed
- ✅ 20M+ merchants
- ✅ Zero fees for crypto-to-crypto

**Setup:** Requires Binance merchant account.

---

## 📝 Integration Steps

### Step 1: Enable Stripe Checkout

Edit `app/services/payment.py`, uncomment Stripe code:

```python
async def _create_stripe_session(self, ...):
    import stripe
    stripe.api_key = settings.STRIPE_SECRET_KEY
    
    session = stripe.checkout.Session.create(
        customer_email=user_email,
        mode='subscription',
        payment_method_types=['card', 'crypto'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': f'AI Whale Service - {tier.value.title()}',
                },
                'unit_amount': int(amount_usd * 100),
                'recurring': {'interval': billing_period},
            },
            'quantity': 1,
        }],
        success_url=success_url,
        cancel_url=cancel_url,
    )
    
    return {
        "session_id": session.id,
        "payment_url": session.url,
        ...
    }
```

### Step 2: Handle Webhooks

Stripe will send webhooks to `https://yourapp.com/v1/payment/webhooks/stripe`.

Edit `app/services/payment.py`:

```python
async def _handle_payment_success(self, payload: Dict):
    customer_email = payload['customer_email']
    amount = payload['amount_total']
    tier = payload['metadata']['tier']
    
    # 1. Create/retrieve user
    user = await get_or_create_user(customer_email)
    
    # 2. Create subscription
    subscription = Subscription(
        user_id=user.id,
        tier=tier,
        status="active",
        amount_usd=amount,
        provider="stripe",
        provider_subscription_id=payload['subscription'],
        current_period_start=datetime.now(),
        current_period_end=datetime.now() + timedelta(days=30),
    )
    db.add(subscription)
    
    # 3. Generate API key
    api_key = APIKey(
        user_id=user.id,
        key=APIKey.generate_key(),
        name=f"{tier.title()} API Key",
    )
    db.add(api_key)
    db.commit()
    
    # 4. Send welcome email
    await send_welcome_email(customer_email, api_key.key)
    
    return {"status": "success"}
```

### Step 3: Add to Customer Dashboard

Create `apps/customer-dashboard/app/pricing/page.tsx`:

```typescript
async function handleCheckout(tier: string, method: string) {
  const response = await fetch('/api/v1/payment/checkout', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: user.email,
      tier,
      billing_period: 'monthly',
      payment_method: method,
      success_url: window.location.origin + '/success',
      cancel_url: window.location.origin + '/pricing',
    }),
  });
  
  const { payment_url } = await response.json();
  window.location.href = payment_url;  // Redirect to payment
}
```

---

## 🧪 Testing

### Test Stripe (Card Payments)

```bash
# Use Stripe test cards
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Test Stripe (Crypto)

```bash
# In test mode, Crypto.com Pay shows a mock UI
# Use test USDC on test networks
```

### Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:8000/v1/payment/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

---

## 🚀 Deployment

### 1. Deploy Backend (Railway)

```bash
# Already set up in your project!
# Just add new environment variables:
railway vars set STRIPE_SECRET_KEY=sk_live_...
railway vars set STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Configure Webhooks

In Stripe Dashboard → Webhooks → Add endpoint:

```
URL: https://your-api.railway.app/v1/payment/webhooks/stripe
Events to send:
- checkout.session.completed
- checkout.session.expired
- payment_intent.succeeded
- payment_intent.payment_failed
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.updated
- customer.subscription.deleted
```

### 3. Deploy Customer Dashboard (Vercel)

```bash
cd apps/customer-dashboard
vercel --prod

# Set environment variable:
vercel env add NEXT_PUBLIC_API_URL https://your-api.railway.app
```

---

## 📊 Analytics & Monitoring

### Revenue Dashboard

Query payment events:

```python
@router.get("/admin/revenue")
async def get_revenue_stats(db: Session = Depends(get_db)):
    total_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.status == "completed"
    ).scalar()
    
    mrr = db.query(func.sum(Subscription.amount_usd)).filter(
        Subscription.status == "active",
        Subscription.billing_period == "monthly"
    ).scalar()
    
    return {
        "total_revenue": total_revenue / 100,  # Convert cents to dollars
        "mrr": mrr / 100,
        "arr": (mrr / 100) * 12,
    }
```

### Conversion Metrics

```python
demo_users = db.query(User).join(APIKey).filter(APIKey.tier == "demo").count()
paid_users = db.query(User).join(Subscription).filter(Subscription.status == "active").count()
conversion_rate = (paid_users / demo_users) * 100
```

---

## 🎯 Next Actions

### Week 1: Stripe Integration
1. Create Stripe account
2. Get API keys
3. Uncomment Stripe code in `payment.py`
4. Test with test card: `4242 4242 4242 4242`
5. Set up webhook endpoint

### Week 2: Database Setup
1. Run `init_db()` to create tables
2. Create user registration endpoint
3. Add API key generation to payment success flow
4. Test full checkout → API key generation

### Week 3: Customer Dashboard UI
1. Create pricing page with payment method selection
2. Implement checkout flow
3. Add success/cancel pages
4. Display API key after payment

### Week 4: Crypto Integration
1. Choose INXY or PayRam
2. Integrate provider API
3. Test with testnet tokens
4. Add "Pay with Crypto" button

### Week 5: Go Live!
1. Switch to live Stripe keys
2. Deploy to production
3. Monitor first transactions
4. Iterate based on user feedback

---

## 💡 Pro Tips

1. **Start with Stripe only** - Get fiat payments working first
2. **Enable Crypto.com via Stripe** - Zero extra code, crypto payments automatically available
3. **Add native crypto later** - INXY or PayRam for the hardcore crypto users
4. **10% crypto discount** - Incentivizes crypto payments, you still profit
5. **Monitor conversion rates** - A/B test pricing, payment methods, copy
6. **Send usage alerts** - Email users at 80%, 90%, 100% quota
7. **Offer annual discounts** - 60% of crypto users prefer upfront payment

---

## 📚 Resources

- **Stripe Docs**: https://stripe.com/docs/payments/checkout
- **Stripe Crypto**: https://stripe.com/docs/crypto
- **INXY Paygate**: https://inxy.com/paygate
- **PayRam**: https://github.com/payram/payram
- **Binance Pay**: https://pay.binance.com/en/merchants

---

## 🆘 Support

Need help? Open an issue or contact:
- Email: support@yourapp.com
- Discord: YourDiscordServer
- GitHub: YourGitHub/ai-whale-service

---

**Built with ❤️ for the crypto-native future of SaaS**
