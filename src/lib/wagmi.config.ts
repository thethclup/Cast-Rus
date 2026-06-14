import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { Attribution } from 'ox/erc8021';
import { BUILDER_CODE } from './erc8021';

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
  dataSuffix: Attribution.toDataSuffix({ codes: [BUILDER_CODE] }),
});

