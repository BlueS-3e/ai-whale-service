"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, TrendingUp, MessageSquare, AlertTriangle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function DemoPage() {  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen relative">
      {/* AI in Space animated background */}
      <AISpaceBackground />
      
      <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Whale Service
            </h1>
          </div>
          <nav className="hidden md:flex gap-4 items-center">
            <Link href="/whale">
              <Button variant="ghost">Whale Tracker</Button>
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
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu panel */}
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
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
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

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI-Powered Crypto Intelligence
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            Track whale movements, analyze market sentiment, and assess risk in real-time
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link href="/whale">
              <Button size="lg" className="w-full sm:w-auto">Try Live Demo</Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">View API Docs</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <Card className="border-2 hover:border-blue-500 transition-all duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader>
              <TrendingUp className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mb-4" />
              <CardTitle className="text-xl md:text-2xl">Whale Movement Prediction</CardTitle>
              <CardDescription className="text-sm md:text-base">
                AI-powered predictions of large wallet movements before they happen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>✓ Real-time transaction monitoring</li>
                <li>✓ Movement probability scoring</li>
                <li>✓ Action recommendations (buy/sell/hold)</li>
              </ul>
              <Link href="/whale">
                <Button className="w-full mt-4 min-h-[44px]">Try Whale Tracker →</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-500 transition-all duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/20">
            <CardHeader>
              <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-purple-600 mb-4" />
              <CardTitle className="text-xl md:text-2xl">Sentiment Analysis</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Analyze social media and news sentiment across multiple sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>✓ Multi-source aggregation</li>
                <li>✓ Bullish/Bearish scoring</li>
                <li>✓ Entity recognition & trends</li>
              </ul>
              <Link href="/sentiment">
                <Button className="w-full mt-4 min-h-[44px]" variant="secondary">Try Sentiment Analyzer →</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-500 transition-all duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-orange-500/20">
            <CardHeader>
              <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-orange-600 mb-4" />
              <CardTitle className="text-xl md:text-2xl">Risk Assessment</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Comprehensive risk scoring for coins and portfolios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>✓ Multi-factor risk analysis</li>
                <li>✓ Smart contract audits</li>
                <li>✓ Liquidity & volatility checks</li>
              </ul>
              <Link href="/risk">
                <Button className="w-full mt-4 min-h-[44px]" variant="outline">Try Risk Scorer →</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Why Integrate Our API?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-3">For Platforms</h3>
                <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                  <li>• Add AI features without building models</li>
                  <li>• Pay per API call (no infrastructure costs)</li>
                  <li>• Real-time data from multiple blockchains</li>
                  <li>• Easy integration with REST API</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-3">For Developers</h3>
                <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                  <li>• Comprehensive API documentation</li>
                  <li>• Client libraries (Python, JavaScript, Go)</li>
                  <li>• Webhook support for real-time alerts</li>
                  <li>• Generous free tier for testing</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
              <p className="text-center font-semibold">
                🚀 Join 500+ platforms already using our API • 10M+ predictions made
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t mt-16 py-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 AI Whale Service • Powered by machine learning</p>
        </div>
      </footer>
    </div>
  );
}
