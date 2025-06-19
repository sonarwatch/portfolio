import { UsdValue } from '../UsdValue';

export function getUsdValueSumStrict(usdValues: UsdValue[]): UsdValue {
  const value = usdValues.reduce(
    (sum, currUsdValue) =>
      sum !== null && currUsdValue !== null ? sum + currUsdValue : null,
    0
  );
  if (value === null || value === 0) return value;
  return Number(value.toFixed(9));
}
