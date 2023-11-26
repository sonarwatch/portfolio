import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'rain';
export const platform: Platform = {
  id: platformId,
  name: 'Rain',
  image: 'https://sonar.watch/img/platforms/rain.png',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  // website: 'https://myplatform.com',
  // twitter: 'https://twitter.com/myplatform',
};

export const programId = new PublicKey(
  'RainEraPU5yDoJmTrHdYynK9739GkEfDsE4ffqce2BR'
);

export const rainApi = 'https://api-v2.rain.fi';
