import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'foo';
export const fooPlatform: Platform = {
  id: platformId,
  name: 'Foo Finanace',
  image: 'https://sonar.watch/img/platforms/foo.png',
  defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const marketsCachePrefix = `${platformId}-markets`;
