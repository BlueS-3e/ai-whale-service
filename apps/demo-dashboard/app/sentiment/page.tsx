"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, MessageSquare, TrendingUp, TrendingDown, Minus, Menu, X, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sentimentApi } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

interface SentimentAnalysis {
  sentiment_label: string;
  sentiment_score: number;
  confidence: number;
  entities?: string[];
}

// Example sentiment texts for demo
const EXAMPLE_TEXTS = [
  { coin: "BTC", text: "Bitcoin is going to the moon! 🚀 This is the next bull run! Strong buy signal!", label: "😊 Bullish Example" },
  { coin: "ETH", text: "Ethereum upgrade looks promising. Strong fundamentals and adoption growing.", label: "😊 Positive ETH" },
  { coin: "DOGE", text: "Dogecoin is crashing hard! Sell everything before it's too late! 📉", label: "😰 Bearish Example" },
  { coin: "BTC", text: "Bitcoin price moving sideways. Waiting for clear direction before entry.", label: "😐 Neutral Example" },
  { coin: "SOL", text: "Solana network congestion issues again. Performance concerns affecting price.", label: "😰 Bearish SOL" },
  { coin: "SHIB", text: "SHIB community is amazing! To the moon! Best investment ever! 🔥🚀", label: "😊 Bullish SHIB" },
];

export default function SentimentPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [text, setText] = useState(EXAMPLE_TEXTS[0].text);
  const [coinSymbol, setCoinSymbol] = useState("BTC");
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const result = await sentimentApi.analyze({
        text,
        coin_symbol: coinSymbol,
      });
      setSentiment(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case "bullish":
        return <TrendingUp className="h-12 w-12 text-green-600" />;
      case "bearish":
        return <TrendingDown className="h-12 w-12 text-red-600" />;
      default:
        return <Minus className="h-12 w-12 text-gray-600" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.6) return "from-green-500 to-emerald-600";
    if (score < -0.6) return "from-red-500 to-rose-600";
    return "from-gray-400 to-gray-500";
  };

  const getSentimentGaugeRotation = (score: number) => {
    // Score ranges from -1 to 1, map to -90deg to 90deg
    return score * 90;
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
              <Button variant="ghost" className="relative font-semibold bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-pink-600" aria-current="page">
                Sentiment
              </Button>
            </Link>
            <Link href="/risk">
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">Risk Assessment</Button>
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
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-purple-900/40 to-pink-900/40 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out panel with glassmorphism */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white via-purple-50/50 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/50 dark:to-pink-950/30 shadow-2xl z-50 md:hidden backdrop-blur-3xl border-l border-purple-500/30 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header with gradient accent */}
              <div className="p-6 pb-4 border-b border-purple-500/20 backdrop-blur-xl bg-gradient-to-r from-purple-600/5 to-pink-600/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Menu</h3>
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
                  <Button variant="default" className="w-full justify-start min-h-[52px] bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-purple-500/50 rounded-xl relative overflow-hidden group" aria-current="page">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <MessageSquare className="h-5 w-5 mr-3 relative z-10" />
                    <span className="relative z-10">Sentiment</span>
                  </Button>
                </Link>
                
                <Link href="/risk" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[52px] hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300 rounded-xl group">
                    <AlertCircle className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
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
              <div className="p-6 pt-4 border-t border-purple-500/20 backdrop-blur-xl bg-gradient-to-r from-purple-600/5 to-pink-600/5">
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sentiment Analyzer
            </h2>
            <p className="text-xl text-muted-foreground">
              AI-powered sentiment analysis from social media and news
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Quick Start Examples */}
            <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  💬 Quick Start Examples
                </CardTitle>
                <CardDescription>Click any text to analyze instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {EXAMPLE_TEXTS.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(example.text);
                      setCoinSymbol(example.coin);
                      setSentiment(null);
                    }}
                    className="w-full p-3 text-left rounded-lg border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 mb-1">
                          {example.coin} - {example.label}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {example.text}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Analyze Text</CardTitle>
                <CardDescription>Or enter your own text to analyze</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text to Analyze</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-sm resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"
                    rows={6}
                    placeholder="Enter text from Twitter, Reddit, news articles..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coin Symbol (optional)</label>
                  <select
                    value={coinSymbol}
                    onChange={(e) => setCoinSymbol(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all"
                  >
                    <option value="BTC">🟠 Bitcoin (BTC)</option>
                    <option value="ETH">🔷 Ethereum (ETH)</option>
                    <option value="SOL">🌅 Solana (SOL)</option>
                    <option value="DOGE">🐕 Dogecoin (DOGE)</option>
                    <option value="SHIB">🐶 Shiba Inu (SHIB)</option>
                    <option value="PEPE">🐸 Pepe (PEPE)</option>
                  </select>
                </div>
                <Button onClick={analyzeText} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" size="lg">
                  {loading ? "Analyzing..." : "💭 Analyze Sentiment"}
                  <MessageSquare className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {sentiment && (
              <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                    Sentiment Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="flex justify-center mb-4">
                      {getSentimentIcon(sentiment.sentiment_label)}
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {sentiment.sentiment_label.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Sentiment</div>
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-4 text-center">Sentiment Gauge</div>
                    <div className="relative w-48 h-24 mx-auto">
                      <div className="absolute inset-0">
                        <div className="w-full h-full border-8 border-gray-200 dark:border-gray-700 rounded-t-full" />
                        <div className={`absolute inset-0 w-full h-full border-8 border-l-transparent border-r-transparent bg-gradient-to-r ${getSentimentColor(sentiment.sentiment_score)} rounded-t-full`}
                             style={{
                               clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
                               transform: `rotate(${getSentimentGaugeRotation(sentiment.sentiment_score)}deg)`,
                               transformOrigin: '50% 100%',
                               transition: 'transform 0.5s ease-out'
                             }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-800 dark:bg-gray-300 rounded-full" />
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-red-600">Bearish</span>
                      <span className="text-gray-600">Neutral</span>
                      <span className="text-green-600">Bullish</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Confidence</span>
                      <span className="font-semibold">{(sentiment.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                        style={{ width: `${sentiment.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {sentiment.entities && sentiment.entities.length > 0 && (
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Detected Entities</div>
                      <div className="flex flex-wrap gap-2">
                        {sentiment.entities.map((entity: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Sentiment Score</div>
                    <div className="text-3xl font-bold">
                      {sentiment.sentiment_score > 0 ? "+" : ""}{(sentiment.sentiment_score * 100).toFixed(1)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multi-Source Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Aggregate sentiment from Twitter, Reddit, news articles, and more
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Live sentiment tracking that updates as new posts and articles are published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entity Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatically detect mentions of coins, influencers, and market events
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-purple-200 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Try These Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => setText("Bitcoin is going to the moon! 🚀 This is the next bull run!")}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="font-medium text-sm">Bullish Example</div>
                <div className="text-xs text-muted-foreground">&quot;Bitcoin is going to the moon! 🚀...&quot;</div>
              </button>
              <button
                onClick={() => setText("Market crash incoming. Sell everything now. This is going to dump hard.")}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="font-medium text-sm">Bearish Example</div>
                <div className="text-xs text-muted-foreground">&quot;Market crash incoming. Sell everything...&quot;</div>
              </button>
              <button
                onClick={() => setText("The market is stable today. No significant movements expected.")}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="font-medium text-sm">Neutral Example</div>
                <div className="text-xs text-muted-foreground">&quot;The market is stable today...&quot;</div>
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
