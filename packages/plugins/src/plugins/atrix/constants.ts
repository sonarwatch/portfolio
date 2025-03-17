import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'atrix';
export const platform: Platform = {
  id: platformId,
  name: 'Atrix',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/atrix.webp',
  defiLlamaId: 'atrix', // from https://defillama.com/docs/api
  website: 'https://app.atrix.finance/liquidity',
  twitter: 'https://x.com/atrixprotocol',
  discord: 'https://discord.com/invite/nfyqSEzUsp',
  description:
    'A Serum-based AMM on Solana allowing for permissionless liquidity and farming.',
  isDeprecated: true,
};
export const atrixV1 = new PublicKey(
  'HvwYjjzPbXWpykgVZhqvvfeeaSraQVnTiQibofaFw9M7'
);

export const atrixV1Staking = new PublicKey(
  'BLDDrex4ZSWBgPYaaH6CQCzkJXWfzCiiur9cSFJT8t3x'
);

export const atrixApi = 'https://api.atrix.finance/api/all';
