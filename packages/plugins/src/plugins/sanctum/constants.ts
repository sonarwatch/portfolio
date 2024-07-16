import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'sanctum';
export const platformImage = 'https://sonar.watch/img/platforms/sanctum.webp';
export const platformWebsite = 'https://www.sanctum.so/';
export const platform: Platform = {
  id: platformId,
  defiLlamaId: 'parent#sanctum', // from https://defillama.com/docs/api
  name: 'Sanctum',
  image: platformImage,
  website: platformWebsite,
  twitter: 'https://twitter.com/sanctumso',
};
export const lstsKey = 'lsts';
