"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Shield, TrendingDown, Menu, X, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { riskApi } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

interface RiskAssessment {
  overall_risk_score: number;
  smart_contract_risk: number;
  liquidity_risk: number;
  volatility_risk: number;
  whale_concentration_risk: number;
  sentiment_risk: number;
}

// Example coins for risk assessment demo
const EXAMPLE_COINS = [
  { coin: "BTC", chain: "ethereum", label: "🟠 Bitcoin (Low Risk)", riskLevel: "low" },
  { coin: "ETH", chain: "ethereum", label: "🔷 Ethereum (Low Risk)", riskLevel: "low" },
  { coin: "MATIC", chain: "polygon", label: "🟣 Polygon (Medium Risk)", riskLevel: "medium" },
  { coin: "DOGE", chain: "ethereum", label: "🐕 Dogecoin (Medium Risk)", riskLevel: "medium" },
  { coin: "SHIB", chain: "ethereum", label: "🐶 Shiba Inu (High Risk)", riskLevel: "high" },
  { coin: "PEPE", chain: "ethereum", label: "🐸 Pepe (High Risk)", riskLevel: "high" },
];

export default function RiskPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coinSymbol, setCoinSymbol] = useState("DOGE");
  const [chain, setChain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<RiskAssessment | null>(null);

  const assessRisk = async () => {
    setLoading(true);
    try {
      const result = await riskApi.assess({
        coin_symbol: coinSymbol,
        chain,
      });
      setRiskData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-green-600";
    if (score <= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return "LOW";
    if (score <= 60) return "MEDIUM";
    return "HIGH";
  };

  const getRiskBgColor = (score: number) => {
    if (score <= 30) return "bg-green-500/10 border-green-300 backdrop-blur-xl";
    if (score <= 60) return "bg-orange-500/10 border-orange-300 backdrop-blur-xl";
    return "bg-red-500/10 border-red-300 backdrop-blur-xl";
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
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Whale Tracker</Button>
            </Link>
            <Link href="/sentiment">
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Sentiment</Button>
            </Link>
            <Link href="/risk">
              <Button variant="ghost" className="relative font-semibold bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-600 after:to-red-600" aria-current="page">
                Risk Assessment
              </Button>
            </Link>
            <Link href="http://localhost:3001/pricing" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">Get API Access ✨</Button>
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
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-orange-900/40 to-red-900/40 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out panel with glassmorphism */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white via-orange-50/50 to-red-50/30 dark:from-gray-900 dark:via-orange-950/50 dark:to-red-950/30 shadow-2xl z-50 md:hidden backdrop-blur-3xl border-l border-orange-500/30 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header with gradient accent */}
              <div className="p-6 pb-4 border-b border-orange-500/20 backdrop-blur-xl bg-gradient-to-r from-orange-600/5 to-red-600/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">Menu</h3>
                    <p className="text-xs text-muted-foreground mt-1">Navigate your experience</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:rotate-90 transition-all duration-300 rounded-full h-10 w-10 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Menu items with staggered animation */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <Link href="/whale" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <TrendingUp className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Whale Tracker</span>
                  </Button>
                </Link>
                
                <Link href="/sentiment" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <MessageSquare className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Sentiment</span>
                  </Button>
                </Link>
                
                <Link href="/risk" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full justify-start min-h-[52px] bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-orange-500/50 rounded-xl relative overflow-hidden group" aria-current="page">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <AlertTriangle className="h-5 w-5 mr-3 relative z-10" />
                    <span className="relative z-10">Risk Assessment</span>
                  </Button>
                </Link>
                
                {/* Divider with gradient */}
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                
                {/* CTA Button with special effects */}
                <Link href="http://localhost:3001/pricing" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full min-h-[56px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="mr-2 text-xl relative z-10">✨</span>
                    <span className="relative z-10 font-extrabold">Get API Access</span>
                    <span className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Button>
                </Link>
              </div>
              
              {/* Footer branding */}
              <div className="p-6 pt-4 border-t border-orange-500/20 backdrop-blur-xl bg-gradient-to-r from-orange-600/5 to-red-600/5">
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Risk Assessment
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive multi-factor risk analysis for cryptocurrencies
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Quick Start Examples */}
            <Card className="border-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  🛡️ Quick Start Examples
                </CardTitle>
                <CardDescription>Click any coin to assess instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {EXAMPLE_COINS.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCoinSymbol(example.coin);
                      setChain(example.chain);
                      setRiskData(null);
                    }}
                    className="w-full p-3 text-left rounded-lg border-2 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400">
                          {example.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Chain: {example.chain.charAt(0).toUpperCase() + example.chain.slice(1)}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Assess Coin Risk</CardTitle>
                <CardDescription>Or enter your own coin to analyze</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Coin Symbol</label>
                  <select
                    value={coinSymbol}
                    onChange={(e) => setCoinSymbol(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 transition-all"
                  >
                    <option value="BTC">🟠 Bitcoin (BTC)</option>
                    <option value="ETH">🔷 Ethereum (ETH)</option>
                    <option value="SOL">🌅 Solana (SOL)</option>
                    <option value="DOGE">🐕 Dogecoin (DOGE)</option>
                    <option value="SHIB">🐶 Shiba Inu (SHIB)</option>
                    <option value="PEPE">🐸 Pepe (PEPE)</option>
                    <option value="MATIC">🟣 Polygon (MATIC)</option>
                    <option value="BONK">💥 Bonk (BONK)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Blockchain</label>
                  <select
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 transition-all"
                  >
                    <option value="ethereum">⟠ Ethereum</option>
                    <option value="bsc">💛 Binance Smart Chain</option>
                    <option value="polygon">🟣 Polygon</option>
                    <option value="solana">🌅 Solana</option>
                    <option value="base">🔵 Base</option>
                  </select>
                </div>
                <Button onClick={assessRisk} disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" size="lg">
                  {loading ? "Analyzing..." : "🛡️ Assess Risk"}
                  <Shield className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {riskData && (
              <Card className={`border-2 ${getRiskBgColor(riskData.overall_risk_score)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    Risk Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg border-2">
                    <div className={`text-5xl font-bold mb-2 ${getRiskColor(riskData.overall_risk_score)}`}>
                      {riskData.overall_risk_score}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">Overall Risk Score</div>
                    <div className={`text-2xl font-bold ${getRiskColor(riskData.overall_risk_score)}`}>
                      {getRiskLevel(riskData.overall_risk_score)} RISK
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Smart Contract Risk</span>
                        <span className={`font-bold ${getRiskColor(riskData.smart_contract_risk)}`}>
                          {riskData.smart_contract_risk}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                          style={{ width: `${riskData.smart_contract_risk}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Liquidity Risk</span>
                        <span className={`font-bold ${getRiskColor(riskData.liquidity_risk)}`}>
                          {riskData.liquidity_risk}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                          style={{ width: `${riskData.liquidity_risk}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Volatility Risk</span>
                        <span className={`font-bold ${getRiskColor(riskData.volatility_risk)}`}>
                          {riskData.volatility_risk}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                          style={{ width: `${riskData.volatility_risk}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Whale Concentration</span>
                        <span className={`font-bold ${getRiskColor(riskData.whale_concentration_risk)}`}>
                          {riskData.whale_concentration_risk}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                          style={{ width: `${riskData.whale_concentration_risk}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Sentiment Risk</span>
                        <span className={`font-bold ${getRiskColor(riskData.sentiment_risk)}`}>
                          {riskData.sentiment_risk}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                          style={{ width: `${riskData.sentiment_risk}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Smart Contract Audit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze contract code for vulnerabilities, backdoors, and suspicious functions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  Liquidity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check locked liquidity, LP token distribution, and rug pull indicators
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Whale Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track large holder concentration and recent whale movements for dump risks
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-orange-200 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Risk Factors Explained</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Smart Contract Risk (0-100)</h4>
                  <p className="text-sm text-muted-foreground">
                    Evaluates code quality, audit status, known vulnerabilities, and suspicious patterns like hidden mints or ownership issues
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Liquidity Risk (0-100)</h4>
                  <p className="text-sm text-muted-foreground">
                    Measures locked liquidity percentage, pool depth, and risk of liquidity removal (rug pull detection)
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Volatility Risk (0-100)</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyzes historical price volatility, market cap stability, and susceptibility to pump-and-dump schemes
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Whale Concentration (0-100)</h4>
                  <p className="text-sm text-muted-foreground">
                    Percentage of supply held by top wallets - high concentration means higher dump risk
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Sentiment Risk (0-100)</h4>
                  <p className="text-sm text-muted-foreground">
                    Market sentiment analysis from social media - sudden shifts can indicate coordinated dumps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
