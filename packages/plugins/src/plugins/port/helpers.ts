export function parseApy(apy: string | undefined): number {
  if (!apy) return 0;
  return Number(apy.replace('%', '')) / 100;
}
