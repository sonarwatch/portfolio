import BigNumber from 'bignumber.js';
import { zeroBigNumber } from './constants';

/**
 * Get the weight of a new TokenPriceSource depending on the size of the pool in USD$ value
 *
 * @param {BigNumber | number} poolTvl Pool total value locked (in USD$)
 * @param {number} [trustValue=100000000] Value (in USD$) from which the weight is 1
 *
 * @returns weight between 0 and 1
 */
export default function getSourceWeight(
  poolTvl: BigNumber | number,
  trustValue = 100000000
): number {
  const fPoolTvl = new BigNumber(poolTvl);
  if (fPoolTvl.isGreaterThanOrEqualTo(trustValue)) return 1;
  if (fPoolTvl.isLessThanOrEqualTo(zeroBigNumber)) return 0;
  return fPoolTvl
    .dividedBy(trustValue)
    .decimalPlaces(6, BigNumber.ROUND_CEIL)
    .toNumber();
}
