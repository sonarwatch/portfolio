import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'wormhole';
export const platform: Platform = {
  id: platformId,
  name: 'Wormhole',
  image: 'https://sonar.watch/img/platforms/wormhole.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  // website: 'https://myplatform.com',
  // twitter: 'https://twitter.com/myplatform',
};

export const apiUrl = 'https://prod-flat-files-min.wormhole.com/';
export const wMint = '85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ';
export const wDecimal = 6;
