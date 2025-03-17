import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'raydium';
export const rayMint = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';
export const platform: Platform = {
  id: platformId,
  name: 'Raydium',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/raydium.webp',
  defiLlamaId: 'raydium',
  website: 'https://raydium.io/',
  documentation: 'https://docs.raydium.io/raydium/',
  discord: 'https://discord.com/invite/raydium',
  telegram: 'https://t.me/raydiumprotocol',
  github: 'https://github.com/raydium-io',
  tokens: [rayMint],
  description:
    'Raydium is an automated market maker (AMM) built on the Solana blockchain which enables lightning-fast trades, permissionless pool creation, and new features for earning yield',
};

export const apiV3 = 'https://api-v3.raydium.io/';

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

export const cpmmProgramId = new PublicKey(
  'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C'
);

export const positionsIdentifier = 'Raydium Concentrated Liquidity';

export const rayDecimals = 6;
