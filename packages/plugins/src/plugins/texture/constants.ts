import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'texture';
export const platform: Platform = {
  id: platformId,
  name: 'Texture',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/texture.webp',
  website: 'https://texture.finance',
  twitter: 'https://twitter.com/texture_fi',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};

export const pid = new PublicKey('MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v');
