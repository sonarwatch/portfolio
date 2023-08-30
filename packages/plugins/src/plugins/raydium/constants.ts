import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'raydium';
export const raydiumPlatform: Platform = {
  id: platformId,
  name: 'Raydium',
  image: 'https://alpha.sonar.watch/img/platforms/raydium.png',
};
export const AMM_PROGRAM_ID_V4 = new PublicKey(
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'
);

export const AMM_PROGRAM_ID_V5 = new PublicKey(
  '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h'
);

export const raydiumProgram = new PublicKey(
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'
);

export const positionsIdentifier = 'Raydium Concentrated Liquidity';
