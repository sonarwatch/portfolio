export function compareName(
  a: string | undefined,
  b: string | undefined
): number {
  if (a === b) return 0;
  if (a === undefined) return -1;
  if (b === undefined) return 1;
  if (a < b) return -1;
  if (b > a) return 1;
  return 0;
}
