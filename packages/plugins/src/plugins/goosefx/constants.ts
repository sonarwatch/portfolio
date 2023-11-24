import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'goosefx';
export const platform: Platform = {
  id: platformId,
  name: 'GooseFX',
  image: 'https://sonar.watch/img/platforms/goosefx.png',
  defiLlamaId: 'goosefx', // from https://defillama.com/docs/api
  website: 'https://app.goosefx.io/farm',
  // twitter: 'https://twitter.com/myplatform',
};

export const programId = new PublicKey(
  'GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn'
);
