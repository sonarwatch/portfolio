/**
 * Compares two names and returns a number indicating their order.
 * @param a - The first name to compare.
 * @param b - The second name to compare.
 * @returns A negative number if `a` comes before `b`, a positive number if `a` comes after `b`, or 0 if they are equal.
 */
export function compareName(
  a: string | undefined,
  b: string | undefined
): number {
  if (a === b) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  if (a < b) return -1;
  if (b > a) return 1;
  return 0;
}
