import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'grass';
export const platform: Platform = {
  id: platformId,
  name: 'Grass',
  image: 'https://sonar.watch/img/platforms/grass.webp',
  website: 'https://www.grassfoundation.io/stake',
  twitter: 'https://twitter.com/getgrass_io',
};

export const pid = new PublicKey(
  'EyxPPowqBRTpZpiDb2ixUR6XUU1VJwTCNgJdK8eyc6kc'
);
export const grassMint = 'Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs';
