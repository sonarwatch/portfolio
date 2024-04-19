import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'phoenix';
export const phoenixPlatform: Platform = {
  id: platformId,
  name: 'Phoenix',
  image: 'https://sonar.watch/img/platforms/phoenix.webp',
  website: 'https://www.phoenix.trade/',
  twitter: 'https://twitter.com/PhoenixTrade',
  defiLlamaId: 'phoenix', // from https://defillama.com/docs/api
};
export const marketsCachePrefix = `${platformId}-markets`;
export const phoenixPid = new PublicKey(
  'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY'
);
export const phoenixSeatManagerPid = new PublicKey(
  'PSMxQbAoDWDbvd9ezQJgARyq6R9L5kJAasaLDVcZwf1'
);
export const marketAccountSize = 445536;
