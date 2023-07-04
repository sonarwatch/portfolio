import { UsdValue } from '../UsdValue';

export function compareUsdValue(a: UsdValue, b: UsdValue): number {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return b - a;
}
