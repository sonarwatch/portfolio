import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'baskt';
export const platform: Platform = {
  id: platformId,
  name: 'baskt',
  image: 'https://sonar.watch/img/platforms/baskt.webp',
  website: 'https://www.baskt.fun/',
  twitter: 'https://x.com/basktdotfun',
};

export const programId = new PublicKey(
  'EspF2G85CDschNBBrzCARnrmykGAbwDjjzQE1DQXXGLx'
);
