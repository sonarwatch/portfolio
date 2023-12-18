export function healthRatioToHealthFactor(
  healthRatio: number | null
): number | null {
  if (healthRatio === null) return null;
  return 1 / (1 - healthRatio);
}
