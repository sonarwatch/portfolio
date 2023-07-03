export default function apyToApr(apy: number, compoundFrequency = 365): number {
  return ((1 + apy) ** (1 / compoundFrequency) - 1) * compoundFrequency;
}
