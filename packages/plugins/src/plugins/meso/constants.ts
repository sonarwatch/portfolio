import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'meso';
export const platform: Platform = {
  id: platformId,
  name: 'Meso',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/meso.webp',
  website: 'https://app.meso.finance/',
  twitter: 'https://x.com/Meso_Finance',
  defiLlamaId: 'meso-finance', // from https://defillama.com/docs/api
};

export const marketsCacheKey = `markets`;
export const userPositionType =
  '0x68476f9d437e3f32fd262ba898b5e3ee0a23a1d586a6cf29a28add35f253f6f7::lending_pool::UserPosition';
export const lendingPoolType =
  '0x68476f9d437e3f32fd262ba898b5e3ee0a23a1d586a6cf29a28add35f253f6f7::lending_pool::LendingPool';
export const poolsApi =
  'https://api.meso.finance/api/v1/pool?page=1&limit=1000';
