import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'tradeport';
export const platform: Platform = {
  id: platformId,
  name: 'Tradeport',
  image: 'https://sonar.watch/img/platforms/tradeport.webp',
  website: 'https://www.tradeport.xyz/',
  twitter: 'https://x.com/tradeportxyz',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const locksCacheKey = `locks`;

export const lockStore =
  '0x4b705de46a79b29276baf45009bc7d6f70cc0f1407f0c9e03cac5729c0c47946';
