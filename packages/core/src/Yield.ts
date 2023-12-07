/**
 * Calculates the Annual Percentage Yield (APY) based on the Annual Percentage Rate (APR).
 * @param apr The Annual Percentage Rate.
 * @param compoundFrequency The number of times the interest is compounded in a year. Default is 365.
 * @returns The Annual Percentage Yield (APY).
 */
export function aprToApy(apr: number, compoundFrequency = 365) {
  return (1 + apr / compoundFrequency) ** compoundFrequency - 1;
}

/**
 * Calculates the Annual Percentage Rate (APR) based on the Annual Percentage Yield (APY).
 * @param apy The Annual Percentage Yield.
 * @param compoundFrequency The number of times the interest is compounded in a year. Default is 365.
 * @returns The Annual Percentage Rate (APR).
 */
export function apyToApr(apy: number, compoundFrequency = 365): number {
  return ((1 + apy) ** (1 / compoundFrequency) - 1) * compoundFrequency;
}

/**
 * Represents the yield information including APR and APY.
 */
export type Yield = {
  apr: number; // APR (Annual Percentage Rate)
  apy: number; // APY (Annual Percentage Yield)
};

/**
 * Creates a Yield object from the given APR.
 * @param apr The Annual Percentage Rate.
 * @returns The Yield object with the calculated APY.
 */
export const createYieldFromApr = (apr: number): Yield => ({
  apr,
  apy: aprToApy(apr),
});

/**
 * Creates a Yield object from the given APY.
 * @param apy The Annual Percentage Yield.
 * @returns The Yield object with the calculated APR.
 */
export const createYieldFromApy = (apy: number): Yield => ({
  apr: apyToApr(apy),
  apy,
});
