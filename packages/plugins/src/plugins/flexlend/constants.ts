import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'flexlend';
export const flexlendPlatform: Platform = {
  id: platformId,
  name: 'FlexLend',
  image: 'https://sonar.watch/img/platforms/flexlend.png',
  defiLlamaId: 'flexlend',
  website: 'https://flexlend.fi/',
  twitter: 'https://twitter.com/flexlend',
};

export const flexProgramId = new PublicKey(
  'FL3X2pRsQ9zHENpZSKDRREtccwJuei8yg9fwDu9UN69Q'
);

export const AUTOMATION_PUBLIC_KEY = new PublicKey(
  '8PWR75ppAGonv9dXStjficjXmdsuDKmDoVNcy4oYhAMs'
);
