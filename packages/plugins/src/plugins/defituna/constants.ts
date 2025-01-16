import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'defituna';
export const platform: Platform = {
  id: platformId,
  name: 'DefiTuna',
  image: 'https://sonar.watch/img/platforms/defituna.webp',
  website: 'https://defituna.com',
};

export const defiTunaProgram = new PublicKey(
  'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD'
);

export const lendingPoolsCacheKey = 'lending-pools';
