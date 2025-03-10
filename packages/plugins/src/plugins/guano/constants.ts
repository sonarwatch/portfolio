import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'guano';
export const platform: Platform = {
  id: platformId,
  name: 'Guano',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/guano.webp',
  website: 'https://www.guanocoin.com/',
  twitter: 'https://x.com/guanocoin',
};

export const stakingPid = new PublicKey(
  'CFjLE5589EiPZvPFiSx7QgktBH8ZTkkGJU2dL7qbJU2a'
);
export const guanoMint = 'APmLv2VarkC5yEjjutYkeK3byr9L2KwCgrVMWHWsgaG7';
