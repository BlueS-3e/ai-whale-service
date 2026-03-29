"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';

export function getWeb3Config() {
  // Use a placeholder project ID if none is provided (checked in Providers component)
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'PLACEHOLDER_PROJECT_ID';

  return getDefaultConfig({
    appName: 'BNB Whale AI',
    projectId,
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
    // RainbowKit/Wagmi relies on browser storage providers; disable SSR config.
    ssr: false,
  });
}
