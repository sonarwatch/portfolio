import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'zelo';
export const platform: Platform = {
  id: platformId,
  name: 'Zelo Finance',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/zelo.webp',
  website: 'https://www.zelofi.io/',
  twitter: 'https://x.com/zelofinance',
  // defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};

export const programId = new PublicKey(
  '3weDTR2PBop8SoYXpQEhdRCA9Wr2JK7gj3CxuUbMo2VJ'
);
