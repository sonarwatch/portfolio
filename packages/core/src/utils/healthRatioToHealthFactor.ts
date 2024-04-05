/**
 * Converts a health ratio to a health factor.
 *
 * @param healthRatio The health ratio to convert.
 * @returns The corresponding health factor.
 *          If the health ratio is null, returns null. Meaning health factor is unknown.
 *          If the health ratio is 1, returns -1. Meaning health factor is infinity.
 */
export function healthRatioToHealthFactor(
  healthRatio: number | null
): number | null {
  if (healthRatio === null) return null;
  if (healthRatio === 1) return -1;
  return 1 / (1 - healthRatio);
}
