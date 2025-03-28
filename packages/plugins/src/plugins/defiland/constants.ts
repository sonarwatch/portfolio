import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'defiland';
export const dflMint = 'DFL1zNkaGPWm1BqAVqRjCZvHmwTFrEaJtbzJWgseoNJh';
export const platform: Platform = {
  id: platformId,
  name: 'Defiland',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/defiland.webp',
  website: 'https://staking.defiland.app/',
  twitter: 'https://x.com/DeFi_Land',
  documentation: 'https://docs.defiland.app/',
  discord: 'https://discord.gg/defiland',
  telegram: 'https://t.me/official_defiland',
  tokens: [dflMint],
  description:
    ' multi-chain agriculture-simulation game created to gamify Decentralized Finance',
};
export const stakingPid = new PublicKey(
  'KJ6b6PswEZeNSwEh1po51wxnbX1C3FPhQPhg8eD2Y6E'
);
