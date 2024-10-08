import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'moonwalk';
export const platform: Platform = {
  id: platformId,
  name: 'Moonwalk',
  image: 'https://sonar.watch/img/platforms/moonwalk.webp',
  website: 'https://app.moonwalk.fit/',
  twitter: 'https://twitter.com/moonwalkfitness',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const gamesCacheId = `games`;
export const programId = new PublicKey(
  'FitAFk15vtx2PBjfr7QTnefaHRx6HwajRiZMt1DdSSKU'
);

export const api = 'https://api.moonwalk.fit/api/users/tokens/';
