import { defineChain } from 'viem';

export const fraxtal = defineChain({
  id: 252,
  network: 'fraxtal',
  name: 'Fraxtal',
  nativeCurrency: { name: 'Frax Ether', symbol: 'frxETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.frax.com'],
    },
    public: {
      http: ['https://rpc.frax.com'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Fraxscan',
      url: 'https://fraxscan.com',
    },
    default: {
      name: 'Fraxscan',
      url: 'https://fraxscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
});
