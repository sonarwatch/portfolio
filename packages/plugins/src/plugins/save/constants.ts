import { PublicKey } from '@solana/web3.js';
import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'save';
export const platformDumpyId = 'dumpy';

export const slndMint = 'SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp';
export const platform: Platform = {
  id: platformId,
  name: 'Save',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/save.webp',
  defiLlamaId: 'save',
  website: 'https://save.finance/',
  discord: 'https://discord.com/invite/J7m48UUPkJ',
  description:
    'Solend is an algorithmic, decentralized protocol for lending and borrowing on Solana. ',
  twitter: 'https://x.com/save_finance',
  documentation: 'https://docs.save.finance/',
  github: 'https://github.com/solendprotocol',
  tokens: [slndMint, 'SAVEaeeqeXNKYb4Lyx28DkUms5gyZ76vGa6fCfdzWfK'],
};

export const platformDumpy: Platform = {
  id: platformDumpyId,
  name: 'Dumpy',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/dumpy.webp',
  // defiLlamaId: 'dumpy',
  website: 'https://dumpy.fun/',
};

export const marketsPrefix = `${platformId}-markets`;
export const marketsKey = 'markets';
export const reservesPrefix = `${platformId}-reserves`;
export const rewardStatsPrefix = `${platformId}-reward-stats`;
export const rewardStatsKey = 'reward-stats';

export const pid = new PublicKey('So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo');
export const merkleProgramId = new PublicKey(
  'mrksLcZ6rMs9xkmJgw6oKiR3GECw44Gb5NeDqu64kiw'
);
export const marketsEndpoint = 'https://api.save.finance/v1/markets/configs';
export const reserveEndpoint = 'https://api.save.finance/v1/reserves/?ids=';
export const wadsDecimal = 18;
export const mainMarket = '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY';
export const rewardProofsEndpoint =
  'https://api.save.finance/liquidity-mining/reward-proofs?obligation=';
export const externalRewardStatsEndpoint =
  'https://api.save.finance/liquidity-mining/external-reward-stats-v2?flat=true';
