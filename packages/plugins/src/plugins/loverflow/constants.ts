import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'loverflow';
export const platform: Platform = {
  id: platformId,
  name: 'loverflow',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/loverflow.webp',
  website: 'https://loverflow.ibx.exchange/claim',
  twitter: 'https://x.com/IBXtrade',
  // defiLlamaId: 'loverflow', // from https://defillama.com/docs/api
};
export const marketsCacheKey = `markets`;

export const pid = new PublicKey(
  '3VQxX1xitpPBXFARqarDQJPLDEUUBPzfUV1s1GPDSCvg'
);
