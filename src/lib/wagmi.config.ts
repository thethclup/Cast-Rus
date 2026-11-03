import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from './erc8021';

// Base Denim Upgrade: 200ms native canonical blocks
// Optimized polling interval for 200ms native block intervals without deprecated Flashblocks/pending tags
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Cast Rush' }),
    walletConnect({ projectId: 'c5208f86fcc78f2cbba06460ea70edfd' })
  ],
  transports: {
    [base.id]: http(undefined, { batch: true, retryCount: 3 }),
    [baseSepolia.id]: http(undefined, { batch: true, retryCount: 3 }),
  },
  pollingInterval: 250, // Denim 200ms canonical block refresh
  dataSuffix: Attribution.toDataSuffix({ codes: [BUILDER_CODE] }),
});


