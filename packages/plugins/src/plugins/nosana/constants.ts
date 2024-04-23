import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'nosana';
export const platform: Platform = {
  id: platformId,
  name: 'Nosana',
  image: 'https://sonar.watch/img/platforms/nosana.webp',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
  website: 'https://app.nosana.io/',
  twitter: 'https://twitter.com/nosana_ci',
};

export const nosMint = 'nosXBVoaCTtYdLvKY6Csb4AC8JCdQKKAaWYtx2ZMoo7';
export const nosDecimals = 6;
export const nosanaStakingPid = new PublicKey(
  'nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE'
);
