"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';

// Use a placeholder project ID if none is provided (will be checked in Providers component)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'PLACEHOLDER_PROJECT_ID';

export const config = getDefaultConfig({
  appName: 'AI Whale Service',
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true,
});
