import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'iloop';
export const platform: Platform = {
  id: platformId,
  name: 'ILoop',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/iloop.webp',
  defiLlamaId: 'iloop',
  website: 'https://app.iloop.finance/',
  twitter: 'https://twitter.com/iLoop_HQ',
};

export const programId = new PublicKey(
  '3i8rGP3ex8cjs7YYWrQeE4nWizuaStsVNUXpRGtMbs3H'
);

export const marketsCacheKey = 'markets';
