import BigNumber from 'bignumber.js';
import { zeroBigNumber } from './constants';

const usdValueForWeightOfOne = new BigNumber(10 ** 9);
/**
 * Get the weight of a new TokenPriceSource depending on the size of the pool in USD$ value
 *
 * @param poolUsdValue Total value in USD$ of the pool
 *
 * @returns weight between 0 and 1
 */
export default function getSourceWeight(poolUsdValue: BigNumber): number {
  if (poolUsdValue.isGreaterThanOrEqualTo(usdValueForWeightOfOne)) return 1;
  if (poolUsdValue.isLessThanOrEqualTo(zeroBigNumber)) return 0;
  return poolUsdValue
    .dividedBy(usdValueForWeightOfOne)
    .decimalPlaces(3, BigNumber.ROUND_CEIL)
    .toNumber();
}
