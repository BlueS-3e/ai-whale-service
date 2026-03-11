"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, HelpCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AISpaceBackground } from "@/components/animated-background";

export default function CancelPage() {
  const router = useRouter();
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="min-h-screen relative">
      <AISpaceBackground />
      
      {/* Header */}
      <header className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Whale Service
            </h1>
          </Link>
        </div>
      </header>

      {/* Cancel Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-yellow-500">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-20 w-20 text-yellow-600" />
              </div>
              <CardTitle className="text-3xl mb-2">Payment Cancelled</CardTitle>
              <CardDescription className="text-lg">
                Your payment was not completed. No charges have been made.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Why users might cancel */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Common Questions
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-gray-900 dark:hover:text-gray-200">
                      What payment methods do you accept?
                    </summary>
                    <p className="mt-2 pl-4">
                      We accept all major credit cards (Visa, Mastercard, Amex), as well as cryptocurrency payments (USDC, USDT, ETH) with a 10% discount on annual plans.
                    </p>
                  </details>
                  
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-gray-900 dark:hover:text-gray-200">
                      Is my payment secure?
                    </summary>
                    <p className="mt-2 pl-4">
                      Yes! All payments are processed through secure, PCI-compliant payment providers (Stripe for cards, and trusted crypto payment gateways). We never store your payment information.
                    </p>
                  </details>
                  
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-gray-900 dark:hover:text-gray-200">
                      Can I try for free first?
                    </summary>
                    <p className="mt-2 pl-4">
                      Absolutely! Try our Demo plan with 100 free API calls per day. No credit card required. <Link href="/" className="text-blue-600 hover:underline">Start now</Link>
                    </p>
                  </details>
                  
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-gray-900 dark:hover:text-gray-200">
                      What's your refund policy?
                    </summary>
                    <p className="mt-2 pl-4">
                      We offer a 14-day money-back guarantee. If you're not satisfied with our service, contact us for a full refund within 14 days of purchase.
                    </p>
                  </details>
                </div>
              </div>

              {/* Action Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What would you like to do?</h3>
                
                <div className="space-y-2">
                  <Link href="/pricing">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 justify-start">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Return to Pricing
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start">
                      Try Demo Dashboard (Free)
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowSupport(!showSupport)}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>

              {/* Support Contact Info */}
              {showSupport && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-semibold">Need Help?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our support team is here to help you with any questions:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong>{' '}
                      <a href="mailto:support@yourapp.com" className="text-blue-600 hover:underline">
                        support@yourapp.com
                      </a>
                    </p>
                    <p>
                      <strong>Response Time:</strong> Usually within 24 hours
                    </p>
                    <p>
                      <strong>Documentation:</strong>{' '}
                      <Link href="/docs" className="text-blue-600 hover:underline">
                        View our help docs
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Pricing Comparison Reminder */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold">Quick Plan Comparison</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                    <p className="font-semibold">Starter</p>
                    <p className="text-2xl font-bold text-blue-600">$49</p>
                    <p className="text-gray-600 dark:text-gray-400">10,000 calls/mo</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded p-3 border-2 border-blue-500">
                    <p className="font-semibold">Growth</p>
                    <p className="text-2xl font-bold text-blue-600">$199</p>
                    <p className="text-gray-600 dark:text-gray-400">100,000 calls/mo</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-600 text-white rounded">
                      Most Popular
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                    <p className="font-semibold">Enterprise</p>
                    <p className="text-2xl font-bold text-blue-600">$999</p>
                    <p className="text-gray-600 dark:text-gray-400">1M+ calls/mo</p>
                  </div>
                </div>
              </div>

              {/* Special Offer */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 text-center">
                <p className="font-semibold mb-1">💎 Special Offer</p>
                <p className="text-sm">
                  Pay yearly with crypto and save 30% total (20% yearly + 10% crypto discount)
                </p>
              </div>

              {/* Footer Note */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
                <p>
                  Still have questions?{' '}
                  <Link href="/docs" className="text-blue-600 hover:underline">
                    Read our FAQ
                  </Link>
                  {' '}or{' '}
                  <a href="mailto:support@yourapp.com" className="text-blue-600 hover:underline">
                    email us
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
