import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';

export const platformId = 'puffcoin';
export const platform: Platform = {
  id: platformId,
  name: 'Puff',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/puffcoin.webp',
  website: 'https://staking.puffcoin.fun/',
};

export const programId = new PublicKey(
  'q8gz8Sww7Xexpqk9DrEMjNXMHnFx6dB3EYe32PwHHd6'
);

export const puffMint = 'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB';
