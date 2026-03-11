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
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Whale Tracker</Button>
            </Link>
            <Link href="/sentiment">
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Sentiment</Button>
            </Link>
            <Link href="/risk">
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Risk Assessment</Button>
            </Link>
            <Link href="http://localhost:3001/pricing" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse">Get API Access ✨</Button>
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
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-purple-900/40 to-blue-900/40 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out panel with glassmorphism */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/30 shadow-2xl z-50 md:hidden backdrop-blur-3xl border-l border-purple-500/30 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header with gradient accent */}
              <div className="p-6 pb-4 border-b border-purple-500/20 backdrop-blur-xl bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Menu</h3>
                    <p className="text-xs text-muted-foreground mt-1">Navigate your experience</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:rotate-90 transition-all duration-300 rounded-full h-10 w-10 p-0"
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
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <AlertTriangle className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Risk Assessment</span>
                  </Button>
                </Link>
                
                {/* Divider with gradient */}
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                
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
              <div className="p-6 pt-4 border-t border-purple-500/20 backdrop-blur-xl bg-gradient-to-r from-blue-600/5 to-purple-600/5">
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
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">🚀 Try Live Demo</Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-purple-500 hover:bg-purple-500 hover:text-white font-semibold hover:scale-105 transition-all duration-300">📖 View API Docs</Button>
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
                <Button className="w-full mt-4 min-h-[44px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300">🐋 Try Whale Tracker →</Button>
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
                <Button className="w-full mt-4 min-h-[44px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">💭 Try Sentiment Analyzer →</Button>
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
                <Button className="w-full mt-4 min-h-[44px] bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">⚠️ Try Risk Scorer →</Button>
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
