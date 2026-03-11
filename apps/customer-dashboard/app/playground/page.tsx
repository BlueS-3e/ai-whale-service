"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Play, Menu, X, Key, BarChart3, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { whaleApi, sentimentApi, riskApi, setApiKey } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function PlaygroundPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"whale" | "sentiment" | "risk">("whale");
  const [apiKey, setApiKeyValue] = useState("supersecretkey");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  // Whale Prediction State
  const [walletAddress, setWalletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
  const [coinSymbol, setCoinSymbol] = useState("BTC");
  const [timeframe, setTimeframe] = useState("24h");

  // Sentiment Analysis State
  const [sentimentText, setSentimentText] = useState("Bitcoin is going to the moon! 🚀");
  const [sentimentCoin, setSentimentCoin] = useState("BTC");

  // Risk Assessment State
  const [riskCoin, setRiskCoin] = useState("DOGE");
  const [chain, setChain] = useState("ethereum");

  const testWhalePredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      setApiKey(apiKey);
      const data = await whaleApi.predict({
        wallet_address: walletAddress,
        coin_symbol: coinSymbol,
        timeframe,
      });
      setResult(data);
    } catch (error: unknown) {
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testSentiment = async () => {
    setLoading(true);
    setResult(null);
    try {
      setApiKey(apiKey);
      const data = await sentimentApi.analyze({
        text: sentimentText,
        coin_symbol: sentimentCoin,
      });
      setResult(data);
    } catch (error: unknown) {
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testRisk = async () => {
    setLoading(true);
    setResult(null);
    try {
      setApiKey(apiKey);
      const data = await riskApi.assess({
        coin_symbol: riskCoin,
        chain,
      });
      setResult(data);
    } catch (error: unknown) {
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <AISpaceBackground />
      <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <h1 className="text-lg md:text-2xl font-bold dark:text-white">AI Whale Service</h1>
          </Link>
          <nav className="hidden md:flex gap-4 items-center">
            <Link href="/api-keys">
              <Button variant="ghost">API Keys</Button>
            </Link>
            <Link href="/usage">
              <Button variant="ghost">Usage</Button>
            </Link>
            <Link href="/playground">
              <Button variant="default">Playground</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost">Docs</Button>
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
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-blue-900/40 to-purple-900/40 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out panel with glassmorphism */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/30 shadow-2xl z-50 md:hidden backdrop-blur-3xl border-l border-blue-500/30 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header with gradient accent */}
              <div className="p-6 pb-4 border-b border-blue-500/20 backdrop-blur-xl bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Dashboard</h3>
                    <p className="text-xs text-muted-foreground mt-1">Manage your API</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:rotate-90 transition-all duration-300 rounded-full h-10 w-10 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Menu items with staggered animation */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <Link href="/api-keys" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <Key className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">API Keys</span>
                  </Button>
                </Link>
                
                <Link href="/usage" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <BarChart3 className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Usage</span>
                  </Button>
                </Link>
                
                <Link href="/playground" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full justify-start min-h-[52px] bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-blue-500/50 rounded-xl relative overflow-hidden group" aria-current="page">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Play className="h-5 w-5 mr-3 relative z-10" />
                    <span className="relative z-10">Playground</span>
                  </Button>
                </Link>
                
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <DollarSign className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Pricing</span>
                  </Button>
                </Link>
                
                <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <FileText className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Documentation</span>
                  </Button>
                </Link>
              </div>
              
              {/* Footer branding */}
              <div className="p-6 pt-4 border-t border-blue-500/20 backdrop-blur-xl bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Connected
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">API Playground</h2>
            <p className="text-muted-foreground">
              Test API endpoints with live data
            </p>
          </div>

          <Card className="mb-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <label className="font-medium">API Key:</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-md font-mono text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Enter your API key"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex border-b dark:border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab("whale")}
                  className={`px-4 py-2 font-medium transition-all duration-200 hover:scale-105 ${
                    activeTab === "whale"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-muted-foreground hover:text-blue-400"
                  }`}
                >
                  Whale Prediction
                </button>
                <button
                  onClick={() => setActiveTab("sentiment")}
                  className={`px-4 py-2 font-medium transition-all duration-200 hover:scale-105 ${
                    activeTab === "sentiment"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-muted-foreground hover:text-purple-400"
                  }`}
                >
                  Sentiment
                </button>
                <button
                  onClick={() => setActiveTab("risk")}
                  className={`px-4 py-2 font-medium transition-all duration-200 hover:scale-105 ${
                    activeTab === "risk"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-muted-foreground hover:text-orange-400"
                  }`}
                >
                  Risk
                </button>
              </div>

              {activeTab === "whale" && (
                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Whale Movement Prediction</CardTitle>
                    <CardDescription>POST /v1/whale/predict</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Wallet Address</label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Coin Symbol</label>
                      <input
                        type="text"
                        value={coinSymbol}
                        onChange={(e) => setCoinSymbol(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Timeframe</label>
                      <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <option value="1h">1 hour</option>
                        <option value="24h">24 hours</option>
                        <option value="7d">7 days</option>
                      </select>
                    </div>
                    <Button onClick={testWhalePredict} disabled={loading} className="w-full hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-blue-500/50 disabled:hover:scale-100 disabled:hover:shadow-none">
                      <Play className="h-4 w-4 mr-2" />
                      {loading ? "Loading..." : "Run Test"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "sentiment" && (
                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Sentiment Analysis</CardTitle>
                    <CardDescription>POST /v1/sentiment/analyze</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Text to Analyze</label>
                      <textarea
                        value={sentimentText}
                        onChange={(e) => setSentimentText(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Coin Symbol (optional)</label>
                      <input
                        type="text"
                        value={sentimentCoin}
                        onChange={(e) => setSentimentCoin(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <Button onClick={testSentiment} disabled={loading} className="w-full hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-purple-500/50 disabled:hover:scale-100 disabled:hover:shadow-none">
                      <Play className="h-4 w-4 mr-2" />
                      {loading ? "Loading..." : "Run Test"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "risk" && (
                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>POST /v1/risk/assess</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Coin Symbol</label>
                      <input
                        type="text"
                        value={riskCoin}
                        onChange={(e) => setRiskCoin(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Blockchain</label>
                      <select
                        value={chain}
                        onChange={(e) => setChain(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <option value="ethereum">Ethereum</option>
                        <option value="bsc">Binance Smart Chain</option>
                        <option value="polygon">Polygon</option>
                      </select>
                    </div>
                    <Button onClick={testRisk} disabled={loading} className="w-full hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-orange-500/50 disabled:hover:scale-100 disabled:hover:shadow-none">
                      <Play className="h-4 w-4 mr-2" />
                      {loading ? "Loading..." : "Run Test"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Response</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <pre className="bg-slate-900 dark:bg-gray-950 text-green-400 p-4 rounded-md overflow-auto max-h-[600px] text-sm">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      Run a test to see the response
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
