import { UsdValue } from '../UsdValue';

const formatUsdValue = (value: UsdValue): number => {
  if (value === null || value === 0) return 0;
  return Number(value.toFixed(9));
};

export function getUsdValueSum(usdValues: UsdValue[]): number {
  return formatUsdValue(
    usdValues.reduce(
      (sum: number, currUsdValue) =>
        currUsdValue !== null ? sum + currUsdValue : sum,
      0
    )
  );
}
