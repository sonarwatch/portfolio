import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'hedgehog';
export const platform: Platform = {
  id: platformId,
  name: 'Hedgehog Markets',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/hedgehog.webp',
  website: 'https://hedgehog.markets',
  twitter: 'https://twitter.com/HedgehogMarket',
  defiLlamaId: 'hedgehog-markets', // from https://defillama.com/docs/api
  discord: 'http://discord.gg/2KusaG9wH7',
  github: 'https://github.com/Hedgehog-Markets',
  medium: 'https://hedgehogmarkets.substack.com/',
  description: 'Prediction markets on Solana',
};
export const ammPid = new PublicKey(
  'Hr4whNgXr3yZsJvx3TVSwfsFgXuSEPB1xKmvgrtLhsrM'
);
export const swapPid = new PublicKey(
  '2ZznCMfx2XP43zaPw9R9wKnjXWiEeEexyhdBPv3UqDtD'
);
