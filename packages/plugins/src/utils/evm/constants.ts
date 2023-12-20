import { ethereumNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const ethFactor = new BigNumber(10 ** ethereumNetwork.native.decimals);
export const ethMantissa = new BigNumber(1).multipliedBy(10 ** 18);

export const blocksPerDayETH = 7200; // 12 sec per block
export const timestampPerYear = 31536000;
export const timestampPerDay = timestampPerYear / 365;
