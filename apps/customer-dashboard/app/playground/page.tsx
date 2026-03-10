"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Play, Menu, X, Key, BarChart3, FileText } from "lucide-react";
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
  const [result, setResult] = useState<any>(null);

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
    } catch (error: any) {
      setResult({ error: error.message });
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
    } catch (error: any) {
      setResult({ error: error.message });
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
    } catch (error: any) {
      setResult({ error: error.message });
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
              <Link href="/api-keys" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </Button>
              </Link>
              <Link href="/usage" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Usage
                </Button>
              </Link>
              <Link href="/playground" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full justify-start min-h-[44px]">
                  <Play className="h-4 w-4 mr-2" />
                  Playground
                </Button>
              </Link>
              <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </Link>
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
