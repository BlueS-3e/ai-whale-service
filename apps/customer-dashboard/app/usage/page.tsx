"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, TrendingUp, DollarSign, Menu, X, Key, BarChart3, Play, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function UsagePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const usageData = {
    currentMonth: {
      calls: 15234,
      cost: 152.34,
      limit: 50000,
    },
    breakdown: [
      { endpoint: "Whale Prediction", calls: 8543, percentage: 56 },
      { endpoint: "Sentiment Analysis", calls: 4231, percentage: 28 },
      { endpoint: "Risk Assessment", calls: 2460, percentage: 16 },
    ],
    history: [
      { date: "March 2026", calls: 15234, cost: 152.34 },
      { date: "February 2026", calls: 12876, cost: 128.76 },
      { date: "January 2026", calls: 9543, cost: 95.43 },
    ],
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
              <Button variant="default">Usage</Button>
            </Link>
            <Link href="/playground">
              <Button variant="ghost">Playground</Button>
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
                  <Button variant="default" className="w-full justify-start min-h-[52px] bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-blue-500/50 rounded-xl relative overflow-hidden group" aria-current="page">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <BarChart3 className="h-5 w-5 mr-3 relative z-10" />
                    <span className="relative z-10">Usage</span>
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
            <h2 className="text-3xl font-bold mb-2">Usage & Billing</h2>
            <p className="text-muted-foreground">
              Monitor your API usage and costs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardDescription>API Calls This Month</CardDescription>
                <CardTitle className="text-3xl">{usageData.currentMonth.calls.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {((usageData.currentMonth.calls / usageData.currentMonth.limit) * 100).toFixed(1)}% of limit
                </div>
                <div className="mt-2 h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(usageData.currentMonth.calls / usageData.currentMonth.limit) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardDescription>Current Bill</CardDescription>
                <CardTitle className="text-3xl flex items-center">
                  <DollarSign className="h-7 w-7" />
                  {usageData.currentMonth.cost.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  $0.01 per API call
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardDescription>Monthly Limit</CardDescription>
                <CardTitle className="text-3xl">{usageData.currentMonth.limit.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {(usageData.currentMonth.limit - usageData.currentMonth.calls).toLocaleString()} calls remaining
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Usage Breakdown</CardTitle>
              <CardDescription>API calls by endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageData.breakdown.map((item) => (
                  <div key={item.endpoint}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.endpoint}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.calls.toLocaleString()} calls ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Past 3 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageData.history.map((month) => (
                  <div key={month.date} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <div className="font-medium">{month.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {month.calls.toLocaleString()} API calls
                      </div>
                    </div>
                    <div className="text-lg font-semibold">${month.cost.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">Download Invoice</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
