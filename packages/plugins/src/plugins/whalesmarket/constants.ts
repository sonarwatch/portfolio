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
  tokens: ['GTH3wG3NErjwcf7VGCoXEXkgXSHvYhx5gtATeeM5JAS1'],
  discord: 'https://discord.com/invite/whalesmarket',
  documentation: 'https://docs.whales.market/',
  github: 'https://github.com/Whales-Market/',
  description:
    'Trade like a pro with advanced tools and features at your fingertips',
};

export const pid = new PublicKey('stPdYNaJNsV3ytS9Xtx4GXXXRcVqVS6x66ZFa26K39S');
export const whalesApi = 'https://api.whales.market/v2/tokens';

export const tokensKey = 'tokens';
export const lastCountKey = 'lastCount';
