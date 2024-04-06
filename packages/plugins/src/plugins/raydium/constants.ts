import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'raydium';
export const raydiumPlatform: Platform = {
  id: platformId,
  name: 'Raydium',
  image: 'https://sonar.watch/img/platforms/raydium.png',
  defiLlamaId: 'raydium',
  website: 'https://raydium.io/',
};

export const AMM_PROGRAM_ID_V3 = new PublicKey(
  'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q'
);

export const AMM_PROGRAM_ID_V4 = new PublicKey(
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'
);

export const AMM_PROGRAM_ID_V5 = new PublicKey(
  '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h'
);

export const raydiumProgram = new PublicKey(
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'
);

export const poolStatesPrefix = `${platformId}-poolSates`;

export const positionsIdentifier = 'Raydium Concentrated Liquidity';

export const rayMint = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';
export const rayDecimals = 6;
