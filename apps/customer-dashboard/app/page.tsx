"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Key, FileText, Play, Activity, Menu, X } from "lucide-react";
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
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <h1 className="text-lg md:text-2xl font-bold">AI Whale Service</h1>
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
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
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

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Welcome to Your Dashboard</h2>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              Manage your API access and monitor whale movements, sentiment, and risk assessment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Key className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg md:text-xl">API Keys</CardTitle>
                <CardDescription className="text-sm">Generate and manage your keys</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/api-keys">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-blue-500/50">Manage Keys</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg md:text-xl">Usage Stats</CardTitle>
                <CardDescription className="text-sm">Monitor your API calls</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/usage">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-green-500/50">View Usage</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Play className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg md:text-xl">Playground</CardTitle>
                <CardDescription className="text-sm">Test endpoints live</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/playground">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-purple-500/50">Test API</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <FileText className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg md:text-xl">Documentation</CardTitle>
                <CardDescription className="text-sm">API reference</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/docs">
                  <Button className="w-full min-h-[44px] hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-orange-500/50">Read Docs</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Get started with the AI Whale Service in minutes</CardDescription>
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
