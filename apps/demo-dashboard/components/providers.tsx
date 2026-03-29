"use client";

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getWeb3Config } from '@/lib/web3-config';
import React, { ReactNode, useEffect, useMemo } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  // If no WalletConnect Project ID is provided, skip Web3 providers
  const hasProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID && 
                       process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== 'YOUR_PROJECT_ID' &&
                       process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== '';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasProjectId) {
      console.warn('WalletConnect Project ID not configured. Web3 features are disabled. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable wallets.');
    }
  }, [mounted, hasProjectId]);

  const config = useMemo(() => (mounted && hasProjectId ? getWeb3Config() : null), [mounted, hasProjectId]);

  if (!mounted || !hasProjectId || !config) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
