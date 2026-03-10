"use client";

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/web3-config';
import { ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

export function Providers({ children }: { children: ReactNode }) {
  // If no WalletConnect Project ID is provided, skip Web3 providers
  const hasProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID && 
                       process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== 'YOUR_PROJECT_ID' &&
                       process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== '';

  if (!hasProjectId) {
    console.warn('⚠️ WalletConnect Project ID not configured. Web3 features will be disabled. Get your ID at https://cloud.walletconnect.com/');
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
