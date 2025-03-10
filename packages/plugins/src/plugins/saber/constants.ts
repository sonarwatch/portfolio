import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'saber';
export const platform: Platform = {
  id: platformId,
  name: 'Saber',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/saber.webp',
  defiLlamaId: 'saber',
  website: 'https://saberdao.io/',
  isDeprecated: true,
};
export const SABER_SWAPS =
  'https://raw.githubusercontent.com/saber-hq/saber-registry-dist/master/data/swaps.mainnet.json';
