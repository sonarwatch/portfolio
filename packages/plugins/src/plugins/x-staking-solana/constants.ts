import {
  platformId as auroryPlatformId,
  auryMint,
  decimals,
  vaultPubkey,
  xAuryMint,
} from '../aurory/constants';
import { platformId as hawksightPlatformId } from '../hawksight/constants';
import { platformId as whalesMarketPlatformId } from '../whalesmarket/constants';
import { platformId as allbridgePlatformId } from '../allbridge/constants';
import { stepfinancePlatform, ligmaPlatform } from '../../orphanPlatforms';

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
    platformId: stepfinancePlatform.id,
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
  {
    mint: 'node3SHFNF7h6N9jbztfVcXrZcvAJdns1xAV8CbYFLG',
    decimals: 6,
    vault: 'ENz6c4ZVYedrcK5V4fh7vwDA1SvZDNDQb1j3KKQbbo8Q',
    xMint: 'xNodeyB1u8WNrKQJqfucbKDMq7LYcAQfYXmqVdDj9M5',
    xDecimals: 6,
    platformId: ligmaPlatform.id,
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
