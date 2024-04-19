import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'saber';
export const platform: Platform = {
  id: platformId,
  name: 'Saber',
  image: 'https://sonar.watch/img/platforms/saber.png',
  defiLlamaId: 'saber',
  website: 'https://app.saber.so/',
};
export const SABER_SWAPS =
  'https://raw.githubusercontent.com/saber-hq/saber-registry-dist/master/data/swaps.mainnet.json';
