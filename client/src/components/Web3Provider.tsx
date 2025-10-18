'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { useState } from 'react';

export const ckConfig = createConfig(
  getDefaultConfig({
    // Your dApp's chains
    chains: [mainnet, polygon, optimism, arbitrum, base],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
      [base.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '4019bf9f3dd24923348169b4e747b3fb',

    // Required App Info
    appName: 'PanAI',

    // Optional App Info
    appDescription: 'Decentralized AI Platform with ENS Authentication',
    appUrl: 'https://panai.app',
    appIcon: 'https://panai.app/logo.png',
  })
);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // Crea il QueryClient una sola volta per componente (importante per SSR)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Con SSR, vogliamo evitare di ri-fetchare immediatamente sul client
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <WagmiProvider config={ckConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
