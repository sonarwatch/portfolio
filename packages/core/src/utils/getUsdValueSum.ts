import { UsdValue } from '../UsdValue';

export function getUsdValueSum(usdValues: UsdValue[]): UsdValue {
  return usdValues.reduce(
    (sum: number, currUsdValue) =>
      currUsdValue !== null ? sum + currUsdValue : sum,
    0
  );
}
