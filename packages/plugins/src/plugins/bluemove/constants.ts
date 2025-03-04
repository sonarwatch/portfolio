import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bluemove';
export const platform: Platform = {
  id: platformId,
  name: 'BlueMove',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/bluemove.webp',
  website: 'https://dex.bluemove.net/',
  twitter: 'https://x.com/BlueMove_OA',
  defiLlamaId: 'parent#bluemove', // from https://defillama.com/docs/api
};
export const lockedLpDataCacheKey = `locked-lp-data`;

export const dexInfoId =
  '0x3f2d9f724f4a1ce5e71676448dc452be9a6243dac9c5b975a588c8c867066e92';

export const lpDecimals = 9;
