"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';

export function WalletConnect() {
  // Check if Web3 is configured
  const hasWeb3Config = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID && 
                        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== 'YOUR_PROJECT_ID' &&
                        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== '';

  // If Web3 is not configured, show info card
  if (!hasWeb3Config) {
    return (
      <Card className="border-2 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Web3 Features Not Configured
          </CardTitle>
          <CardDescription>
            To enable wallet connection, add your WalletConnect Project ID to the .env.local file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. Get a free Project ID at <a href="https://cloud.walletconnect.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cloud.walletconnect.com</a></p>
            <p>2. Add it to <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">.env.local</code>:</p>
            <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs overflow-auto">
              NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
            </pre>
            <p>3. Restart the development server</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { address, isConnected, chain } = useAccount();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: balance } = useBalance({ address });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { disconnect } = useDisconnect();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isConnected && address) {
      console.log('Wallet connected:', address);
      // Here you can track the connected wallet or store it in your backend
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Connect to track your portfolio and receive personalized alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-green-600" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Address</div>
          <div className="font-mono text-sm bg-white dark:bg-gray-900 p-2 rounded border">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Network</div>
          <div className="font-medium">{chain?.name || 'Unknown'}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Balance</div>
          <div className="font-medium">
            {balance?.formatted ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
          </div>
        </div>
        <div className="flex gap-2">
          <ConnectButton />
          <Button variant="outline" onClick={() => disconnect()}>
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
