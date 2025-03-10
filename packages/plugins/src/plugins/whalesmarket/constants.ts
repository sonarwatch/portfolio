import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'whalesmarket';
export const platform: Platform = {
  id: platformId,
  name: 'Whales Market',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/whalesmarket.webp',
  defiLlamaId: 'whales-market', // from https://defillama.com/docs/api
  website: 'https://app.whales.market/',
  twitter: 'https://twitter.com/WhalesMarket',
};

export const pid = new PublicKey('stPdYNaJNsV3ytS9Xtx4GXXXRcVqVS6x66ZFa26K39S');
export const whalesApi = 'https://api.whales.market/v2/tokens';

export const tokensKey = 'tokens';
export const lastCountKey = 'lastCount';
