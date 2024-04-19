import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bskt';
export const bsktPlatform: Platform = {
  id: platformId,
  name: 'BSKT',
  image: 'https://sonar.watch/img/platforms/bskt.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://claim.bskt.fi/',
  twitter: 'https://twitter.com/bsktfi',
};

export const bsktPid = new PublicKey(
  'BSKTvA6XG9QyqhW5Hgq8pG8pm5NnvuYyc4pYefSzM62X'
);

export const bsktDecimals = 5;
export const bsktMint = '6gnCPhXtLnUD76HjQuSYPENLSZdG8RvDB1pTLM5aLSJA';
