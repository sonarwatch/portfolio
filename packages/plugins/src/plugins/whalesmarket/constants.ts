import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'whalesmarket';
export const platform: Platform = {
  id: platformId,
  name: 'Whales Market',
  image: 'https://sonar.watch/img/platforms/whalesmarket.png',
  defiLlamaId: 'whales-market', // from https://defillama.com/docs/api
  website: 'https://app.whales.market/',
  twitter: 'https://twitter.com/WhalesMarket',
};

export const pid = new PublicKey('stPdYNaJNsV3ytS9Xtx4GXXXRcVqVS6x66ZFa26K39S');
