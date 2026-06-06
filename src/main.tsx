import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './lib/web3/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
