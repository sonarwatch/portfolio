import { UsdValue } from '../UsdValue';

export function getUsdValueSumStrict(usdValues: UsdValue[]): UsdValue {
  return usdValues.reduce(
    (sum, currUsdValue) =>
      sum !== null && currUsdValue !== null ? sum + currUsdValue : null,
    0
  );
}
