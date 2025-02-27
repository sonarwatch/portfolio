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

export const programIdV3 = new PublicKey(
  'rDeFiHPjHZRLiz4iBzMw3zv6unZs4VwdU6qQcVd3NSK'
);

export const rainApi = 'https://api-v2.rain.fi';
export const rainApiV3 = 'https://api-v3.rain.fi/api/';
export const collectionsKey = 'collections';
