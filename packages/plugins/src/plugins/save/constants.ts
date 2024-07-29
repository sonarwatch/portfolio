import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'save';
export const platform: Platform = {
  id: platformId,
  name: 'Save',
  image: 'https://sonar.watch/img/platforms/save.webp',
  defiLlamaId: 'save',
  website: 'https://save.finance/',
};
export const marketsPrefix = `${platformId}-markets`;
export const reservesPrefix = `${platformId}-reserves`;
export const marketsKey = 'markets';

export const pid = new PublicKey('So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo');
export const merkleProgramId = new PublicKey(
  'mrksLcZ6rMs9xkmJgw6oKiR3GECw44Gb5NeDqu64kiw'
);
export const marketsEndpoint = 'https://api.solend.fi/v1/markets/configs';
export const reserveEndpoint = 'https://api.solend.fi/v1/reserves/?ids=';
export const wadsDecimal = 18;
export const mainMarket = '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY';
export const externalRewardsEndpoint =
  'https://global.solend.fi/liquidity-mining/external-reward-score-v2?wallet=';
export const rewardsEndpoint =
  'https://global.solend.fi/liquidity-mining/reward-proofs?obligation=';

export const slndMint = 'SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp';
