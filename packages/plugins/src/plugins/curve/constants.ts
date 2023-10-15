import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'curve';
export const fooPlatform: Platform = {
  id: platformId,
  name: 'Curve Finance',
  image: 'https://sonar.watch/img/platforms/curve.png',
  defiLlamaId: 'parent#curve-finance',
};
export const marketsCachePrefix = `${platformId}-markets`;
