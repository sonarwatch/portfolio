import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'perena';
export const platform: Platform = {
  id: platformId,
  name: 'Perena',
  image: 'https://sonar.watch/img/platforms/perena.webp',
  website: 'https://perena.com/',
  twitter: 'https://x.com/perena_finance',
};

export const pid = new PublicKey('NUMERUNsFCP3kuNmWZuXtm1AaQCPj9uw6Guv2Ekoi5P');
