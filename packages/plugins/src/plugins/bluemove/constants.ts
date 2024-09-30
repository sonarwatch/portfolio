import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bluemove';
export const platform: Platform = {
  id: platformId,
  name: 'BlueMove',
  image: 'https://sonar.watch/img/platforms/bluemove.webp',
  website: 'https://dex.bluemove.net/',
  twitter: 'https://x.com/BlueMove_OA',
  defiLlamaId: 'bluemove', // from https://defillama.com/docs/api
};
export const marketsCacheKey = `markets`;

export const packageId =
  '0xb24b6789e088b876afabca733bed2299fbc9e2d6369be4d1acfa17d8145454d9';

export const dexInfoId =
  '0x3f2d9f724f4a1ce5e71676448dc452be9a6243dac9c5b975a588c8c867066e92';

export const lpDecimals = 9;
