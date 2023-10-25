import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'solend';
export const solendPlatform: Platform = {
  id: platformId,
  name: 'Solend',
  image: 'https://sonar.watch/img/platforms/solend.png',
  defiLlamaId: 'solend',
};
export const marketsPrefix = `${platformId}-markets`;
export const reservesPrefix = `${platformId}-reserves`;

export const pid = new PublicKey('So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo');
export const marketsEndpoint = 'https://api.solend.fi/v1/markets/configs';
export const reserveEndpoint = 'https://api.solend.fi/v1/reserves/?ids=';
export const wadsDecimal = 18;
