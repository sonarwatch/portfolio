import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'gpool';
export const platform: Platform = {
  id: platformId,
  name: 'GPool',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/gpool.webp',
  website: 'https://stake.gpool.cloud/',
};

export const stakingPid = new PublicKey(
  'poo1sKMYsZtDDS7og73L68etJQYyn6KXhXTLz1hizJc'
);
