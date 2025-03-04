import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'pyth';
export const platform: Platform = {
  id: platformId,
  name: 'Pyth',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/pyth.webp',
  defiLlamaId: 'pyth-network', // from https://defillama.com/docs/api
  website: 'https://staking.pyth.network/',
  twitter: 'https://twitter.com/PythNetwork',
};

export const stakingProgramId = new PublicKey(
  'pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ'
);
export const pythMint = 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3';
