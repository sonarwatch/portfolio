import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'sandglass';
export const platform: Platform = {
  id: platformId,
  name: 'Sandglass',
  image: 'https://sonar.watch/img/platforms/sandglass.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://sandglass.so/',
  twitter: 'https://twitter.com/sandglass_so',
};

export const programId = new PublicKey(
  'SANDsy8SBzwUE8Zio2mrYZYqL52Phr2WQb9DDKuXMVK'
);
export const marketsInfoKey = 'markets';
