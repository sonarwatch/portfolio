import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'yearn';
export const platform: Platform = {
  id: platformId,
  name: 'Yearn',
  image: 'https://sonar.watch/img/platforms/yearn.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  // website: 'https://myplatform.com',
  // twitter: 'https://twitter.com/myplatform',
};
export const vaultsKey = 'vaults';
export const yearnApiUrl = 'https://api.yexporter.io/v1/chains';
