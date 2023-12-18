export function healthFactorToHealthRatio(
  healthFactor: number | null
): number | null {
  if (healthFactor === null) return null;
  return 1 - 1 / healthFactor;
}
