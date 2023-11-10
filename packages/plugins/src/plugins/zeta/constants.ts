import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'zeta';
export const zetaPlatform: Platform = {
  id: platformId,
  name: 'Zeta',
  image: 'https://sonar.watch/img/platforms/zeta.png',
  defiLlamaId: 'zeta',
};

export const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const programId = new PublicKey(
  'ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD'
);
