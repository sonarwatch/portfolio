import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'atrix';
export const platform: Platform = {
  id: platformId,
  name: 'Atrix',
  image: 'https://sonar.watch/img/platforms/atrix.png',
  defiLlamaId: 'atrix', // from https://defillama.com/docs/api
  website: 'https://app.atrix.finance/liquidity',
  // twitter: 'https://twitter.com/myplatform',
};
export const atrixV1 = new PublicKey(
  'HvwYjjzPbXWpykgVZhqvvfeeaSraQVnTiQibofaFw9M7'
);

export const atrixV1Staking = new PublicKey(
  'BLDDrex4ZSWBgPYaaH6CQCzkJXWfzCiiur9cSFJT8t3x'
);

export const atrixApi = 'https://api.atrix.finance/api/all';
