"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Building2, 
  Wallet, 
  CreditCard,
  ChevronRight,
  Activity
} from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";
import { paymentApi } from "@/lib/api-client";

interface PricingTier {
  name: string;
  monthly_price: number;
  yearly_price?: number;
  monthly_calls: number;
  rate_limit_per_minute: number;
  features: string[];
  description: string;
}

interface PricingData {
  tiers: Record<string, PricingTier>;
  payment_methods: string[];
  crypto_discount: number;
}

const tierIcons = {
  demo: Sparkles,
  starter: Zap,
  growth: Building2,
  enterprise: Building2,
};

const tierColors = {
  demo: "border-gray-300 dark:border-gray-700",
  starter: "border-blue-500 dark:border-blue-400",
  growth: "border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/50",
  enterprise: "border-yellow-500 dark:border-yellow-400",
};

export default function PricingPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const data = await paymentApi.getPricing();
      setPricingData(data);
    } catch (error) {
      console.error('Failed to load pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (
    tierKey: string, 
    paymentMethod: 'stripe_card' | 'stripe_crypto'
  ) => {
    if (!email && !isConnected) {
      alert('Please enter your email or connect your wallet');
      return;
    }

    try {
      setCheckoutLoading(tierKey);
      
      const response = await paymentApi.checkout({
        email: email || (isConnected ? `${address}@wallet.crypto` : ''),
        tier: tierKey,
        billing_period: billingPeriod,
        payment_method: paymentMethod,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/pricing`,
      });

      // Redirect to payment URL
      window.location.href = response.payment_url;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const getPrice = (tier: PricingTier) => {
    const price = billingPeriod === 'yearly' ? tier.yearly_price : tier.monthly_price;
    return price || tier.monthly_price;
  };

  const getSavings = (tier: PricingTier) => {
    if (!tier.yearly_price || billingPeriod === 'monthly') return null;
    const monthlyCost = tier.monthly_price * 12;
    const savings = monthlyCost - tier.yearly_price;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const tiers = pricingData?.tiers || {};
  const orderedTiers = ['demo', 'starter', 'growth', 'enterprise'];

  return (
    <div className="min-h-screen relative">
      <AISpaceBackground />
      
      {/* Header */}
      <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Whale Service
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Start tracking whales and analyzing crypto sentiment with AI-powered insights
            </p>
            
            {/* Billing Period Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white dark:bg-gray-700 shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-white dark:bg-gray-700 shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Yearly
                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Email Input */}
          {!isConnected && (
            <div className="max-w-md mx-auto mb-8">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Enter Your Email</CardTitle>
                  <CardDescription className="text-center">
                    Or connect your wallet for crypto payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">or</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ConnectButton />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isConnected && (
            <div className="flex justify-center mb-8">
              <ConnectButton />
            </div>
          )}

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {orderedTiers.map((tierKey) => {
              const tier = tiers[tierKey];
              if (!tier) return null;

              const Icon = tierIcons[tierKey as keyof typeof tierIcons];
              const price = getPrice(tier);
              const savings = getSavings(tier);
              const isPopular = tierKey === 'growth';

              return (
                <Card
                  key={tierKey}
                  className={`relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all ${
                    tierColors[tierKey as keyof typeof tierColors]
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-6 w-6 text-blue-600" />
                      <CardTitle className="capitalize">{tier.name}</CardTitle>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                          ${price === 0 ? '0' : price.toLocaleString()}
                        </span>
                        {price > 0 && (
                          <span className="text-gray-600 dark:text-gray-400">
                            /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        )}
                      </div>
                      {savings && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Save ${savings.amount} ({savings.percentage}%)
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">API Calls/Month</span>
                        <span className="font-semibold">{tier.monthly_calls.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Rate Limit</span>
                        <span className="font-semibold">{tier.rate_limit_per_minute}/min</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm capitalize">{feature.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2">
                    {tierKey === 'demo' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleCheckout(tierKey, 'stripe_card')}
                          disabled={checkoutLoading === tierKey || (!email && !isConnected)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {checkoutLoading === tierKey ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Pay with Card
                            </span>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleCheckout(tierKey, 'stripe_crypto')}
                          disabled={checkoutLoading === tierKey || (!email && !isConnected)}
                          variant="outline"
                          className="w-full"
                        >
                          <span className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Pay with Crypto
                            {billingPeriod === 'yearly' && (
                              <span className="text-xs text-green-600">-10%</span>
                            )}
                          </span>
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="mt-16">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Payment Methods</CardTitle>
                <CardDescription>Choose the payment method that works best for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Traditional Payments</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        Credit/Debit Cards (Visa, Mastercard, Amex)
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        Apple Pay & Google Pay
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        Automatic billing & invoices
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">Crypto Payments</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        USDC, USDT, ETH (Ethereum, Polygon, Base)
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        10% discount on annual plans
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        Zero chargebacks, instant settlement
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ / CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need a custom plan? Contact us for enterprise pricing
            </p>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                View API Documentation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
