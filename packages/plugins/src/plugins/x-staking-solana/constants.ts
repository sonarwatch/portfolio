import { Platform } from '@sonarwatch/portfolio-core';
import {
  platformId as auroryPlatformId,
  auryMint,
  decimals,
  vaultPubkey,
  xAuryMint,
} from '../aurory/constants';
import { platformId as hawksightPlatformId } from '../hawksight/constants';
import { platformId as whalesMarketPlatformId } from '../whalesmarket/constants';

export const stepFinancePlatformId = 'stepfinance';
export const stepFinancePlatform: Platform = {
  id: stepFinancePlatformId,
  name: 'Step Finance',
  image: 'https://sonar.watch/img/platforms/stepfinance.png',
  website: 'https://app.step.finance/',
  twitter: 'https://twitter.com/StepFinance_',
};

export const allbridgePlatformId = 'allbridge';
export const allbridgePlatform: Platform = {
  id: allbridgePlatformId,
  name: 'Allbridge',
  image: 'https://sonar.watch/img/platforms/allbridge.png',
  website: 'https://stake.allbridge.io/?chain=SOL',
  twitter: 'https://twitter.com/Allbridge_io',
};

export const xStakingConfigs: StakingConfig[] = [
  {
    mint: auryMint,
    decimals,
    vault: vaultPubkey,
    xMint: xAuryMint,
    xDecimals: 9,
    platformId: auroryPlatformId,
  },
  {
    mint: 'GTH3wG3NErjwcf7VGCoXEXkgXSHvYhx5gtATeeM5JAS1',
    decimals: 6,
    vault: 'Cm1KT2iqQ3LoxbmLy4WrQ9wE7WByJx6R512A28LbjGh9',
    xMint: '3wCoTb3TArUdzmeTBPzPFyPBUP6EJXaW5LAzGsWCpySu',
    xDecimals: 6,
    platformId: whalesMarketPlatformId,
  },
  {
    mint: 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT',
    decimals: 9,
    vault: 'ANYxxG365hutGYaTdtUQG8u2hC4dFX9mFHKuzy9ABQJi',
    xMint: 'xStpgUCss9piqeFUk2iLVcvJEGhAdJxJQuwLkXP555G',
    xDecimals: 9,
    platformId: stepFinancePlatformId,
  },
  {
    mint: 'a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp',
    decimals: 9,
    vault: '51dd7AuT32b5VCK2rBVrjLGvfuvZ3kMayNrZZbWuvas2',
    xMint: 'xAx6d1sjmBvpWkVZQEqgUvPmGBNndEXPxYpr3QVp61H',
    xDecimals: 9,
    platformId: allbridgePlatformId,
  },
  {
    mint: 'BKipkearSqAUdNKa1WDstvcMjoPsSKBuNyvKDQDDu9WE',
    decimals: 6,
    vault: '2eFeetCpZJprr67F2dToT52BbSkdeqKZT6hmVdVG14eU',
    xMint: 'xHWKW3Yyji9xe6FnTmDqu3rBApt3Ysu5ysywUA85Len',
    xDecimals: 6,
    platformId: hawksightPlatformId,
  },
];

export type StakingConfig = {
  mint: string;
  decimals: number;
  vault: string;
  xMint: string;
  xDecimals: number;
  platformId: string;
};
