import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'joule';
export const platform: Platform = {
  id: platformId,
  name: 'Joule',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/joule.webp',
  website: 'https://app.joule.finance/',
  twitter: 'https://twitter.com/JouleFinance',
  defiLlamaId: 'joule-finance', // from https://defillama.com/docs/api
};

export const marketsCacheKey = `markets`;
export const api = 'https://price-api.joule.finance/api/market';
export const userPositionMapType =
  '0x2fe576faa841347a9b1b32c869685deb75a15e3f62dfe37cbd6d52cc403a16f6::pool::UserPositionsMap';
