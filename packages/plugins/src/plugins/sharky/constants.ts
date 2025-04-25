import { PublicKey } from '@solana/web3.js';

export const platformId = 'sharky';
export const collectionsCacheKey = `${platformId}-collections`;
export const tokensOrderBooksCacheKey = `${platformId}-tokens-orderbooks`;
export const cachePrefix = `${platformId}`;

export const sharkyProgram = new PublicKey(
  'SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP'
);

export const loanDataSize = 338;
export const orderBookDataSize = 10240;
