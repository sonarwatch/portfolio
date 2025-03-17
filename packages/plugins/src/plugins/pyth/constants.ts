import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'pyth';
export const pythMint = 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3';
export const platform: Platform = {
  id: platformId,
  name: 'Pyth',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/pyth.webp',
  defiLlamaId: 'pyth-network', // from https://defillama.com/docs/api
  website: 'https://staking.pyth.network/',
  twitter: 'https://twitter.com/PythNetwork',
  github: 'https://github.com/pyth-network',
  discord: 'https://discord.com/invite/pythnetwork',
  documentation: 'https://docs.pyth.network/home',
  tokens: [pythMint],
  description:
    'Secure your smart contracts with reliable, low-latency market data from institutional sources. Build apps with high-fidelity oracle feeds designed for mission-critical systems.',
};

export const stakingProgramId = new PublicKey(
  'pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ'
);
