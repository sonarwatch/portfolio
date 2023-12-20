import BigNumber from 'bignumber.js';
import { blocksPerDayETH, ethMantissa, timestampPerDay } from './constants';

export function ratePerBlockToApy(rate: number): number {
  const apy = new BigNumber(rate)
    .dividedBy(ethMantissa)
    .multipliedBy(blocksPerDayETH)
    .plus(1)
    .pow(365)
    .minus(1);
  return apy.toNumber();
}

export function ratePerTimestampToApy(rate: number): number {
  const apy = new BigNumber(rate)
    .dividedBy(ethMantissa)
    .multipliedBy(timestampPerDay)
    .plus(1)
    .pow(365)
    .minus(1);
  return apy.toNumber();
}
