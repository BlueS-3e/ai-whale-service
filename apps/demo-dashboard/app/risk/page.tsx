"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Shield, TrendingDown, Menu, X, MessageSquare, TrendingUp } from "lucide-react";
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
              <Button variant="ghost">Whale Tracker</Button>
            </Link>
            <Link href="/sentiment">
              <Button variant="ghost">Sentiment</Button>
            </Link>
            <Link href="/risk">
              <Button variant="default">Risk Assessment</Button>
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
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
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
                <Button variant="default" className="w-full justify-start min-h-[44px]">
                  <AlertTriangle className="h-4 w-4 mr-2" />
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Risk Assessment
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive multi-factor risk analysis for cryptocurrencies
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Assess Coin Risk</CardTitle>
                <CardDescription>Analyze smart contract, liquidity, and volatility risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <option value="BONK">Bonk (BONK)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Blockchain</label>
                  <select
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="ethereum">Ethereum</option>
                    <option value="bsc">Binance Smart Chain</option>
                    <option value="polygon">Polygon</option>
                    <option value="solana">Solana</option>
                    <option value="base">Base</option>
                  </select>
                </div>
                <Button onClick={assessRisk} disabled={loading} className="w-full" size="lg">
                  {loading ? "Analyzing..." : "Assess Risk"}
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
