import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { DATA_SUFFIX } from './erc8021';

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Cast Rush' }),
    walletConnect({ projectId: 'c5208f86fcc78f2cbba06460ea70edfd' }) // generic template id
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
});

