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

export const defiLendingProgramId = new PublicKey(
  'rDeFiHPjHZRLiz4iBzMw3zv6unZs4VwdU6qQcVd3NSK'
);
export const bankProgramId = new PublicKey(
  'rain2M5b9GeFCk792swkwUu51ZihHJb3SUQ8uHxSRJf'
);

export const rainApiV3 = 'https://api-v3.rain.fi/api/';
export const collectionsKey = 'collections';
