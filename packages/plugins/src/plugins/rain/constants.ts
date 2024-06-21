import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'rain';
export const platform: Platform = {
  id: platformId,
  name: 'Rain',
  image: 'https://sonar.watch/img/platforms/rain.webp',
  defiLlamaId: 'rain.fi', // from https://defillama.com/docs/api
  website: 'https://rain.fi/',
  twitter: 'https://twitter.com/RainFi_',
};

export const programId = new PublicKey(
  'RainEraPU5yDoJmTrHdYynK9739GkEfDsE4ffqce2BR'
);

export const rainApi = 'https://api-v2.rain.fi';
export const collectionsKey = 'collections';
export const skipCacheRefreshInterval = 3600000;
