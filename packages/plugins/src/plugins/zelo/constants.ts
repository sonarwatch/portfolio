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
  documentation: 'https://blocksmithlabs-1.gitbook.io/zelo-docs',
  discord: 'https://discord.gg/blocksmithlabs',
  github: 'https://github.com/Blocksmith-Labs',
  description: "Solana's Lossless Lottery Savings Protocol ",
};

export const programId = new PublicKey(
  '3weDTR2PBop8SoYXpQEhdRCA9Wr2JK7gj3CxuUbMo2VJ'
);
