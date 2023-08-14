import { PublicKey } from '@solana/web3.js';

export const platformId = 'orders';

export const jupiterLimitProgramId = new PublicKey(
  'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu'
);

export const serumProgramId = new PublicKey(
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX'
);

export const serumMarketUrl =
  'https://raw.githubusercontent.com/openbook-dex/openbook-ts/master/packages/openbook/src/markets.json';

export const serumMarketPrefix = `${platformId}-serumMarkets`;
