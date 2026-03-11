"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Book, Code, Zap, Menu, X, Key, BarChart3, Play, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Button variant="ghost">Playground</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/docs">
              <Button variant="default">Docs</Button>
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
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <Play className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Playground</span>
                  </Button>
                </Link>
                
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <DollarSign className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Pricing</span>
                  </Button>
                </Link>
                
                <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full justify-start min-h-[52px] bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-blue-500/50 rounded-xl relative overflow-hidden group" aria-current="page">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <FileText className="h-5 w-5 mr-3 relative z-10" />
                    <span className="relative z-10">Documentation</span>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">API Documentation</h2>
            <p className="text-xl text-muted-foreground">
              Complete reference for the AI Whale Service API
            </p>
          </div>

          <Card className="mb-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Get Your API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Visit the <Link href="/api-keys" className="text-blue-600 hover:underline">API Keys page</Link> to generate your key
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Make Your First Request</h3>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-md text-xs overflow-x-auto">
{`curl -X POST http://localhost:8000/v1/whale/predict \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "coin_symbol": "BTC",
    "timeframe": "24h"
  }'`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="h-6 w-6" />
                Endpoints
              </h3>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Whale Movement Prediction</CardTitle>
                  <CardDescription>POST /v1/whale/predict</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">Predict large wallet movements using AI analysis</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Request Body:</h4>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-xs">
{`{
  "wallet_address": "string",
  "coin_symbol": "string",
  "timeframe": "1h|24h|7d" // optional
}`}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Response:</h4>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-xs">
{`{
  "movement_probability": 0.85,
  "confidence": 0.92,
  "predicted_action": "sell",
  "risk_level": "high",
  "estimated_amount": 250000,
  "timeframe": "24h"
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>POST /v1/sentiment/analyze</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">Analyze sentiment from text or social media</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Request Body:</h4>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-xs">
{`{
  "text": "string", // optional
  "coin_symbol": "string", // optional
  "sources": ["twitter", "reddit"] // optional
}`}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Response:</h4>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-xs">
{`{
  "sentiment_score": 0.75,
  "sentiment_label": "bullish",
  "confidence": 0.88,
  "entities": ["BTC", "BITCOIN"],
  "sources_analyzed": ["twitter", "reddit"]
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>POST /v1/risk/assess</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">Comprehensive risk scoring for cryptocurrencies</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Request Body:</h4>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-xs">
{`{
  "coin_symbol": "string",
  "chain": "ethereum|bsc|polygon" // optional
}`}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Response:</h4>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-xs">
{`{
  "overall_risk_score": 42,
  "risk_level": "medium",
  "smart_contract_risk": 30,
  "liquidity_risk": 25,
  "volatility_risk": 60,
  "whale_concentration_risk": 45,
  "sentiment_risk": 50
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Book className="h-6 w-6" />
                Authentication
              </h3>
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <p className="mb-4">All API requests require authentication using an API key in the header:</p>
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-md text-sm">
                    X-API-Key: your_api_key_here
                  </pre>
                </CardContent>
              </Card>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">Rate Limits</h3>
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Free Tier:</strong> 1,000 requests per month</li>
                    <li>• <strong>Pro Tier:</strong> 50,000 requests per month</li>
                    <li>• <strong>Enterprise:</strong> Unlimited requests</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">Error Codes</h3>
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-4">
                      <code className="bg-slate-100 px-2 py-1 rounded">400</code>
                      <span>Bad Request - Invalid parameters</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-slate-100 px-2 py-1 rounded">401</code>
                      <span>Unauthorized - Invalid API key</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-slate-100 px-2 py-1 rounded">429</code>
                      <span>Rate Limited - Too many requests</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-slate-100 px-2 py-1 rounded">500</code>
                      <span>Server Error - Internal error</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Need more help?</p>
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-blue-500/50">View Interactive API Docs →</Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
