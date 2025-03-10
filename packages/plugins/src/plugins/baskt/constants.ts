import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'baskt';
export const platform: Platform = {
  id: platformId,
  name: 'baskt',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/baskt.webp',
  website: 'https://www.baskt.fun/',
  twitter: 'https://x.com/basktdotfun',
  documentation: 'https://www.baskt.fun/about#features',
  description: 'Tokenizing on-chain narratives.',
  telegram: 'https://t.me/basktfun',
};

export const programId = new PublicKey(
  'EspF2G85CDschNBBrzCARnrmykGAbwDjjzQE1DQXXGLx'
);
