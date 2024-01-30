import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'aries';
export const platform: Platform = {
  id: platformId,
  name: 'Aries',
  image: 'https://sonar.watch/img/platforms/aries.png',
  defiLlamaId: 'aries-markets', // from https://defillama.com/docs/api
  website: 'https://app.ariesmarkets.xyz/',
  twitter: 'https://twitter.com/AriesMarkets',
};

export const programId =
  '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3';

export const apiUrl = 'https://api-v2.ariesmarkets.xyz/';
