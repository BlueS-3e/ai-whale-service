"use client";

import { useState } from "react";
import Link from "next/link";
import { Key, Copy, Trash2, Plus, Activity, Menu, X, BarChart3, Play, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function APIKeysPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Production Key",
      key: "sk_live_1234567890abcdef",
      created: "2026-03-01",
      lastUsed: "2026-03-09",
      calls: 15234,
    },
    {
      id: "2",
      name: "Development Key",
      key: "sk_test_abcdef1234567890",
      created: "2026-02-15",
      lastUsed: "2026-03-08",
      calls: 543,
    },
  ]);

  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const generateKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      calls: 0,
    };
    
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setShowNewKey(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In production, show a toast notification
  };

  const deleteKey = (id: string) => {
    if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
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
              <Button variant="default">API Keys</Button>
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
                  <Button variant="default" className="w-full justify-start min-h-[52px] bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-blue-500/50 rounded-xl relative overflow-hidden group" aria-current="page">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Key className="h-5 w-5 mr-3 relative z-10" />
                    <span className="relative z-10">API Keys</span>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">API Keys</h2>
              <p className="text-muted-foreground">
                Manage your API keys for authentication
              </p>
            </div>
            <Button onClick={() => setShowNewKey(true)} className="hover:scale-105 transition-transform duration-200 hover:shadow-lg hover:shadow-blue-500/50">
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </div>

          {showNewKey && (
            <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Generate New API Key</CardTitle>
                <CardDescription>Give your key a descriptive name</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="e.g., Production Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && generateKey()}
                  />
                  <Button onClick={generateKey}>Generate</Button>
                  <Button variant="outline" onClick={() => {
                    setShowNewKey(false);
                    setNewKeyName("");
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        {apiKey.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                      </CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-4 bg-slate-100 dark:bg-gray-800 rounded-md font-mono text-sm">
                    <span className="flex-1">{apiKey.key}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 flex gap-8 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Calls:</span>
                      <span className="ml-2 font-semibold">{apiKey.calls.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 text-green-600 font-semibold">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 border-orange-200 dark:border-orange-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">⚠️ Security Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Never share your API keys publicly or commit them to version control</li>
                <li>• Use environment variables to store keys in your applications</li>
                <li>• Rotate keys regularly and delete unused keys immediately</li>
                <li>• Use separate keys for development and production environments</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
