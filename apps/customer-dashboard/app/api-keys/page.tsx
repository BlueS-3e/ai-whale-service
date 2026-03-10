"use client";

import { useState } from "react";
import Link from "next/link";
import { Key, Copy, Trash2, Plus, Activity, Menu, X, BarChart3, Play, FileText } from "lucide-react";
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
                <Button variant="default" className="w-full justify-start min-h-[44px]">
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
