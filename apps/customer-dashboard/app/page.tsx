"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Key, FileText, Play, Activity, Menu, X, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <AISpaceBackground />
      <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-amber-500" />
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">BNB Whale AI</h1>
          </div>
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
                    <h3 className="font-bold text-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">Dashboard</h3>
                    <p className="text-xs text-muted-foreground mt-1">Manage your API</p>
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
                <Link href="/api-keys" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <Key className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">API Keys</span>
                  </Button>
                </Link>
                
                <Link href="/usage" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <BarChart3 className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Usage</span>
                  </Button>
                </Link>
                
                <Link href="/playground" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <Play className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Playground</span>
                  </Button>
                </Link>
                
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <DollarSign className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Pricing</span>
                  </Button>
                </Link>
                
                <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <FileText className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Documentation</span>
                  </Button>
                </Link>
              </div>
              
              {/* Footer branding */}
              <div className="p-6 pt-4 border-t border-amber-500/20 backdrop-blur-xl bg-gradient-to-r from-amber-600/5 to-orange-600/5">
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

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Welcome to Your Dashboard</h2>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              Manage your API access and monitor whale movements, sentiment, and risk assessment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Key className="h-8 w-8 text-amber-500 mb-2" />
                <CardTitle className="text-lg md:text-xl">API Keys</CardTitle>
                <CardDescription className="text-sm">Generate and manage your keys</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/api-keys">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-amber-500/50">Manage Keys</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-500 mb-2" />
                <CardTitle className="text-lg md:text-xl">Usage Stats</CardTitle>
                <CardDescription className="text-sm">Monitor your API calls</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/usage">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-orange-500/50">View Usage</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Play className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle className="text-lg md:text-xl">Playground</CardTitle>
                <CardDescription className="text-sm">Test endpoints live</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/playground">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-yellow-500/50">Test API</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <FileText className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle className="text-lg md:text-xl">Documentation</CardTitle>
                <CardDescription className="text-sm">API reference</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/docs">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-amber-500/50">Read Docs</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Get started with BNB Whale AI in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Generate an API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Visit the API Keys page to create your first key
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Test in Playground</h3>
                  <p className="text-sm text-muted-foreground">
                    Try out whale predictions, sentiment analysis, and risk assessment
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. Integrate Your App</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our API documentation to integrate with your application
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
