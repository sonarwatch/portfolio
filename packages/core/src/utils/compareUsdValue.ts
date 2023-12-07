/**
 * Compares two UsdValue objects and returns a number indicating their relative order.
 * @param a - The first UsdValue object to compare.
 * @param b - The second UsdValue object to compare.
 * @returns A negative number if `a` is less than `b`, a positive number if `a` is greater than `b`, or 0 if they are equal.
 */
import { UsdValue } from '../UsdValue';

export function compareUsdValue(a: UsdValue, b: UsdValue): number {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return b - a;
}
