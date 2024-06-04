import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'hedgehog';
export const platform: Platform = {
  id: platformId,
  name: 'Hedgehog Markets',
  image: 'https://sonar.watch/img/platforms/hedgehog.webp',
  website: 'https://hedgehog.markets',
  twitter: 'https://twitter.com/HedgehogMarket',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const ammPid = new PublicKey(
  'Hr4whNgXr3yZsJvx3TVSwfsFgXuSEPB1xKmvgrtLhsrM'
);
export const swapPid = new PublicKey(
  '2ZznCMfx2XP43zaPw9R9wKnjXWiEeEexyhdBPv3UqDtD'
);
export const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const usdcDecimals = 6;
