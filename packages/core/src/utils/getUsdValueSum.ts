import { UsdValue } from '../UsdValue';

export function getUsdValueSum(usdValues: UsdValue[]): number {
  return Number(
    usdValues
      .reduce(
        (sum: number, currUsdValue) =>
          currUsdValue !== null ? sum + currUsdValue : sum,
        0
      )
      .toFixed(9)
  );
}
