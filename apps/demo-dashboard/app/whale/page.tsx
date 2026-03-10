"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, TrendingUp, AlertCircle, ArrowRight, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { whaleApi } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function WhalePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
  const [coinSymbol, setCoinSymbol] = useState("BTC");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

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
      case "hold": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen relative">
      <AISpaceBackground />
      <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Whale Service
            </h1>
          </Link>
          <nav className="hidden md:flex gap-4 items-center">
            <Link href="/whale">
              <Button variant="default">Whale Tracker</Button>
            </Link>
            <Link href="/sentiment">
              <Button variant="ghost">Sentiment</Button>
            </Link>
            <Link href="/risk">
              <Button variant="ghost">Risk Assessment</Button>
            </Link>
            <Button>Get API Access</Button>
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
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden backdrop-blur-xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Menu</h3>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Link href="/whale" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full justify-start min-h-[44px]">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Whale Tracker
                </Button>
              </Link>
              <Link href="/sentiment" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sentiment
                </Button>
              </Link>
              <Link href="/risk" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Risk Assessment
                </Button>
              </Link>
              <Button className="w-full min-h-[44px]" onClick={() => setMobileMenuOpen(false)}>
                Get API Access
              </Button>
            </div>
          </div>
        </>
      )}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Whale Movement Predictor
            </h2>
            <p className="text-xl text-muted-foreground">
              AI-powered predictions of large wallet movements before they happen
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Analyze Wallet</CardTitle>
                <CardDescription>Enter a wallet address to predict movement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coin Symbol</label>
                  <select
                    value={coinSymbol}
                    onChange={(e) => setCoinSymbol(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="DOGE">Dogecoin (DOGE)</option>
                    <option value="SHIB">Shiba Inu (SHIB)</option>
                    <option value="PEPE">Pepe (PEPE)</option>
                  </select>
                </div>
                <Button onClick={analyzeTrans} disabled={loading} className="w-full" size="lg">
                  {loading ? "Analyzing..." : "Predict Movement"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {prediction && (
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    AI Prediction Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
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
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
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
          </div>

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

          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-blue-600" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  <div>
                    <strong>Data Collection:</strong> We monitor on-chain transactions, wallet balances, and historical patterns
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  <div>
                    <strong>AI Analysis:</strong> Our ML models analyze patterns and predict future movements
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  <div>
                    <strong>Risk Scoring:</strong> Each prediction includes confidence levels and risk assessment
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
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
