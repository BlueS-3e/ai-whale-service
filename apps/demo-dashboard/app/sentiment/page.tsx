"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, MessageSquare, TrendingUp, TrendingDown, Minus, Menu, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sentimentApi } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AISpaceBackground } from "@/components/animated-background";

export default function SentimentPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [text, setText] = useState("Bitcoin is going to the moon! 🚀 This is the next bull run!");
  const [coinSymbol, setCoinSymbol] = useState("BTC");
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState<any>(null);

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
              <Button variant="ghost">Whale Tracker</Button>
            </Link>
            <Link href="/sentiment">
              <Button variant="default">Sentiment</Button>
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
                <Button variant="default" className="w-full justify-start min-h-[44px]">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sentiment
                </Button>
              </Link>
              <Link href="/risk" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start min-h-[44px]">
                  <AlertCircle className="h-4 w-4 mr-2" />
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sentiment Analyzer
            </h2>
            <p className="text-xl text-muted-foreground">
              AI-powered sentiment analysis from social media and news
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Analyze Text</CardTitle>
                <CardDescription>Enter text or let us scan social media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text to Analyze</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-sm resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    rows={6}
                    placeholder="Enter text from Twitter, Reddit, news articles..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coin Symbol (optional)</label>
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
                  </select>
                </div>
                <Button onClick={analyzeText} disabled={loading} className="w-full" size="lg">
                  {loading ? "Analyzing..." : "Analyze Sentiment"}
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
                <div className="text-xs text-muted-foreground">"Bitcoin is going to the moon! 🚀..."</div>
              </button>
              <button
                onClick={() => setText("Market crash incoming. Sell everything now. This is going to dump hard.")}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="font-medium text-sm">Bearish Example</div>
                <div className="text-xs text-muted-foreground">"Market crash incoming. Sell everything..."</div>
              </button>
              <button
                onClick={() => setText("The market is stable today. No significant movements expected.")}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="font-medium text-sm">Neutral Example</div>
                <div className="text-xs text-muted-foreground">"The market is stable today..."</div>
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
