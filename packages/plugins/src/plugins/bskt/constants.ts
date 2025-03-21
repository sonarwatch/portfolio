import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bskt';
export const bsktMint = '6gnCPhXtLnUD76HjQuSYPENLSZdG8RvDB1pTLM5aLSJA';
export const platform: Platform = {
  id: platformId,
  name: 'BSKT',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/bskt.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://claim.bskt.fi/',
  twitter: 'https://twitter.com/bsktfi',
  discord: 'https://discord.gg/VdSdWqpqQ6',
  telegram: 't.me/BSKT_FI',
  description:
    'Baskets of assets in a portfolio, bridging liquidity cross-chain.',
  documentation: 'https://www.bskt.fi/bskt-whitepaper.pdf',
  tokens: [bsktMint],
};

export const bsktPid = new PublicKey(
  'BSKTvA6XG9QyqhW5Hgq8pG8pm5NnvuYyc4pYefSzM62X'
);
export const bsktStakingPid = new PublicKey(
  'DF8vgzUDH2CGywD7Gd9jd9Y5Kwmrx97h4Viumjo4rrr6'
);

export const bsktDecimals = 5;
