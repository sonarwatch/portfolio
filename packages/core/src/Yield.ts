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
 * Represents a yield information with APR and APY (as fraction).
 * If negative, it means that it costs money to hold the asset.
 */
export type Yield = {
  /**
   * APR (Annual Percentage Rate) as fraction.
   * 0.25 means 25% APR
   * -0.25 means -25% APR
   */
  apr: number;
  /**
   * APY (Annual Percentage Yield) as fraction.
   * 0.28 means 28% APY
   * -0.28 means -28% APR
   */
  apy: number;
};

/**
 * Creates a Yield object from the given APR.
 * @param apr The Annual Percentage Rate.
 * @returns The Yield object with the calculated APY.
 */
export const yieldFromApr = (apr: number): Yield => ({
  apr,
  apy: aprToApy(apr),
});

/**
 * Creates a Yield object from the given APY.
 * @param apy The Annual Percentage Yield.
 * @returns The Yield object with the calculated APR.
 */
export const yieldFromApy = (apy: number): Yield => ({
  apr: apyToApr(apy),
  apy,
});
