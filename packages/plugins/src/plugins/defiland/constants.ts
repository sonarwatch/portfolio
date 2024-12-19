import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'defiland';
export const platform: Platform = {
  id: platformId,
  name: 'Defiland',
  image: 'https://sonar.watch/img/platforms/defiland.webp',
  website: 'https://staking.defiland.app/',
  twitter: 'https://x.com/DeFi_Land',
};
export const dflMint = 'DFL1zNkaGPWm1BqAVqRjCZvHmwTFrEaJtbzJWgseoNJh';
export const stakingPid = new PublicKey(
  'KJ6b6PswEZeNSwEh1po51wxnbX1C3FPhQPhg8eD2Y6E'
);
