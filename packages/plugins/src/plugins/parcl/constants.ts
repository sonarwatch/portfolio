import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'parcl';
export const platform: Platform = {
  id: platformId,
  name: 'Parcl',
  image: 'https://sonar.watch/img/platforms/parcl.png',
  defiLlamaId: 'parent#parcl', // from https://defillama.com/docs/api
  website: 'https://app.parcl.co/',
  twitter: 'https://twitter.com/Parcl',
};

export const programId = new PublicKey(
  '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y'
);

export const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const usdcDecimals = 6;
