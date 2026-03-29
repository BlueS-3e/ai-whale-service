"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, TrendingUp, AlertCircle, ArrowRight, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { whaleApi } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

interface WhalePrediction {
  movement_probability: number;
  predicted_action: string;
  risk_level: string;
  confidence: number;
  estimated_amount?: number;
}

// Example whale wallets for demo
const EXAMPLE_WHALES: Record<string, { address: string; label: string }> = {
  BTC: { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", label: "Bitcoin Whale #1" },
  ETH: { address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8", label: "Binance Hot Wallet" },
  SOL: { address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1", label: "Solana Whale" },
  DOGE: { address: "0x28C6c06298d514Db089934071355E5743bf21d60", label: "Dogecoin Whale" },
  SHIB: { address: "0x1406899696adb2fa7a95ea68e80d4f9c82fcdedd", label: "SHIB Top Holder" },
  PEPE: { address: "0x8d3e3a57c5f140b5f9feb0d43d37a347ee01c851", label: "PEPE Whale" },
  MATIC: { address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", label: "Polygon Whale" },
  LINK: { address: "0x98c63b7b319dfbdf3d811530f2ab9dfe4983af9d", label: "Chainlink Whale" },
  UNI: { address: "0x1a9c8182c09f50c8318d769245bea52c32be35bc", label: "Uniswap Whale" },
  AVAX: { address: "0x9f8c163cba728e99993abe7495f06c0a3c8ac8b9", label: "Avalanche Whale" },
};

export default function WhalePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(EXAMPLE_WHALES.BTC.address);
  const [coinSymbol, setCoinSymbol] = useState("BTC");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<WhalePrediction | null>(null);

  const analyzeTrans = async () => {
    setLoading(true);
    try {
      const result = await whaleApi.predict({
        wallet_address: walletAddress,
        coin_symbol: coinSymbol,
        timeframe: "24h",
      });
      setPrediction(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadExampleWallet = () => {
    const example = EXAMPLE_WHALES[coinSymbol];
    if (example) {
      setWalletAddress(example.address);
      setPrediction(null); // Clear previous prediction
    }
  };

  const handleCoinChange = (newCoin: string) => {
    setCoinSymbol(newCoin);
    // Auto-load example wallet for the new coin
    const example = EXAMPLE_WHALES[newCoin];
    if (example) {
      setWalletAddress(example.address);
      setPrediction(null);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "sell": return "bg-red-500";
      case "buy": return "bg-green-500";
      case "hold": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen relative">
      <AISpaceBackground />
      <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-amber-500" />
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              BNB Whale AI
            </h1>
          </Link>
          <nav className="hidden md:flex gap-4 items-center">
            <Link href="/whale">
              <Button variant="ghost" className="relative font-semibold bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-amber-600 after:to-orange-600" aria-current="page">
                Whale Tracker
              </Button>
            </Link>
            <Link href="/sentiment">
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Sentiment</Button>
            </Link>
            <Link href="/risk">
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Risk Assessment</Button>
            </Link>
            <Link href="http://localhost:3001/pricing" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">Get API Access ✨</Button>
            </Link>
            <ThemeToggle />
          </nav>
          {/* Mobile menu button */}
          <div className="flex md:hidden gap-2 items-center">
            <ThemeToggle />
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <>
          {/* Animated backdrop with blur */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-amber-900/40 to-orange-900/40 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out panel with glassmorphism */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:via-amber-950/50 dark:to-orange-950/30 shadow-2xl z-50 md:hidden backdrop-blur-3xl border-l border-amber-500/30 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header with gradient accent */}
              <div className="p-6 pb-4 border-b border-amber-500/20 backdrop-blur-xl bg-gradient-to-r from-amber-600/5 to-orange-600/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">Menu</h3>
                    <p className="text-xs text-muted-foreground mt-1">Navigate your experience</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:rotate-90 transition-all duration-300 rounded-full h-10 w-10 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Menu items with staggered animation */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <Link href="/whale" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full justify-start min-h-[52px] bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-amber-500/50 rounded-xl relative overflow-hidden group" aria-current="page">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <TrendingUp className="h-5 w-5 mr-3 relative z-10" />
                    <span className="relative z-10">Whale Tracker</span>
                  </Button>
                </Link>
                
                <Link href="/sentiment" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <MessageSquare className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Sentiment</span>
                  </Button>
                </Link>
                
                <Link href="/risk" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <AlertCircle className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Risk Assessment</span>
                  </Button>
                </Link>
                
                {/* Divider with gradient */}
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                
                {/* CTA Button with special effects */}
                <Link href="http://localhost:3001/pricing" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full min-h-[56px] bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="mr-2 text-xl relative z-10">✨</span>
                    <span className="relative z-10 font-extrabold">Get API Access</span>
                    <span className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Button>
                </Link>
              </div>
              
              {/* Footer branding */}
              <div className="p-6 pt-4 border-t border-amber-500/20 backdrop-blur-xl bg-gradient-to-r from-amber-600/5 to-orange-600/5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Live Demo
                  </span>
                  <span className="font-mono">v1.0</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Whale Movement Predictor
            </h2>
            <p className="text-xl text-muted-foreground">
              AI-powered predictions of large wallet movements before they happen
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Quick Start Examples */}
            <Card className="border-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  🚀 Quick Start Examples
                </CardTitle>
                <CardDescription>Click any whale to analyze instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(EXAMPLE_WHALES).map(([coin, { address, label }]) => (
                  <button
                    key={coin}
                    onClick={() => {
                      setCoinSymbol(coin);
                      setWalletAddress(address);
                      setPrediction(null);
                    }}
                    className="w-full p-3 text-left rounded-lg border-2 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400">
                          {coin} - {label}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          {address.length > 40 ? `${address.slice(0, 20)}...${address.slice(-10)}` : address}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Analyze Wallet</CardTitle>
                <CardDescription>Or enter your own wallet address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Coin Symbol</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadExampleWallet}
                      className="text-xs text-amber-600 hover:text-amber-700 h-auto py-1"
                    >
                      📝 Load Example
                    </Button>
                  </div>
                  <select
                    value={coinSymbol}
                    onChange={(e) => handleCoinChange(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all"
                  >
                    <option value="BTC">🟠 Bitcoin (BTC)</option>
                    <option value="ETH">🔷 Ethereum (ETH)</option>
                    <option value="SOL">🌅 Solana (SOL)</option>
                    <option value="DOGE">🐕 Dogecoin (DOGE)</option>
                    <option value="SHIB">🐶 Shiba Inu (SHIB)</option>
                    <option value="PEPE">🐸 Pepe (PEPE)</option>
                    <option value="MATIC">🟣 Polygon (MATIC)</option>
                    <option value="LINK">🔗 Chainlink (LINK)</option>
                    <option value="UNI">🦄 Uniswap (UNI)</option>
                    <option value="AVAX">🔺 Avalanche (AVAX)</option>
                  </select>
                  {EXAMPLE_WHALES[coinSymbol] && walletAddress === EXAMPLE_WHALES[coinSymbol].address && (
                    <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      ✨ Using example: {EXAMPLE_WHALES[coinSymbol].label}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all"
                    placeholder="0x... or paste any wallet address"
                  />
                </div>
                <Button onClick={analyzeTrans} disabled={loading} className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" size="lg">
                  {loading ? "Analyzing..." : "🔮 Predict Movement"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {prediction && (
            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  AI Prediction Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg">
                  <div className="text-5xl font-bold text-amber-600 mb-2">
                    {(prediction.movement_probability * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Movement Probability</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className={`text-2xl font-bold ${getActionColor(prediction.predicted_action)} text-white px-3 py-1 rounded-full inline-block mb-2`}>
                      {prediction.predicted_action.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">Predicted Action</div>
                  </div>

                  <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className={`text-2xl font-bold ${getRiskColor(prediction.risk_level)} mb-2`}>
                      {prediction.risk_level.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Level</div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Confidence</span>
                    <span className="font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-orange-600"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {prediction.estimated_amount && (
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Estimated Amount</div>
                    <div className="text-2xl font-bold">${prediction.estimated_amount.toLocaleString()}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track whale wallets 24/7 with instant alerts when large movements are detected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ML-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced machine learning models trained on millions of historical transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multi-Chain Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor wallets across Ethereum, BSC, Polygon, and other major blockchains
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  <div>
                    <strong>Data Collection:</strong> We monitor on-chain transactions, wallet balances, and historical patterns
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  <div>
                    <strong>AI Analysis:</strong> Our ML models analyze patterns and predict future movements
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  <div>
                    <strong>Risk Scoring:</strong> Each prediction includes confidence levels and risk assessment
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                  <div>
                    <strong>Actionable Insights:</strong> Get clear buy/sell/hold recommendations
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
