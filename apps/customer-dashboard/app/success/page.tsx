"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AISpaceBackground } from "@/components/animated-background";
import { paymentApi } from "@/lib/api-client";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id');
    const paymentId = searchParams.get('payment_id');
    const method = searchParams.get('method') || 'stripe_card';

    if (!sessionId && !paymentId) {
      setError('No payment information found');
      setVerifying(false);
      return;
    }

    try {
      const id = sessionId || paymentId;
      if (id) {
        const result = await paymentApi.verifyPayment(id, method);
        setPaymentInfo(result);
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      setError('Failed to verify payment. Please contact support.');
    } finally {
      setVerifying(false);
    }
  };

  const copyApiKey = () => {
    if (paymentInfo?.api_key) {
      navigator.clipboard.writeText(paymentInfo.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AISpaceBackground />
        <Card className="w-full max-w-md relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
              <p className="text-lg">Verifying your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AISpaceBackground />
        <Card className="w-full max-w-md relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Verification Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/pricing')} className="w-full">
              Back to Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {/* Success Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-green-500">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-20 w-20 text-green-600 animate-bounce" />
              </div>
              <CardTitle className="text-3xl mb-2">Payment Successful! 🎉</CardTitle>
              <CardDescription className="text-lg">
                Welcome to AI Whale Service. Your subscription is now active.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {paymentInfo && (
                <>
                  {/* Payment Details */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                      <span className="font-semibold">
                        ${paymentInfo.amount_paid} {paymentInfo.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                      <span className="font-semibold capitalize">
                        {paymentInfo.payment_method?.replace('_', ' ')}
                      </span>
                    </div>
                    {paymentInfo.paid_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date</span>
                        <span className="font-semibold">
                          {new Date(paymentInfo.paid_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* API Key (if provided) */}
                  {paymentInfo.api_key && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Your API Key</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Keep this key secure. You'll need it to access the API.
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={paymentInfo.api_key}
                          readOnly
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-sm"
                        />
                        <Button onClick={copyApiKey} variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      {copied && (
                        <p className="text-sm text-green-600">Copied to clipboard!</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Next Steps */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What's Next?</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>✓ Check your email for a receipt and welcome message</p>
                  <p>✓ Manage your API keys in the dashboard</p>
                  <p>✓ View usage analytics and billing history</p>
                  <p>✓ Read our documentation to get started</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/api-keys" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    View API Keys
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Read Documentation
                  </Button>
                </Link>
              </div>

              {/* Support */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
                <p>
                  Need help getting started?{' '}
                  <Link href="/docs" className="text-blue-600 hover:underline">
                    Check our docs
                  </Link>
                  {' '}or{' '}
                  <a href="mailto:support@yourapp.com" className="text-blue-600 hover:underline">
                    contact support
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
