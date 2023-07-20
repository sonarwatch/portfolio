export function aprToApy(apr: number, compoundFrequency = 365) {
  return (1 + apr / compoundFrequency) ** compoundFrequency - 1;
}

export function apyToApr(apy: number, compoundFrequency = 365): number {
  return ((1 + apy) ** (1 / compoundFrequency) - 1) * compoundFrequency;
}

export type Yield = {
  // 0.05 mean 5% APR
  apr: number;
  // 0.05 mean 5% APY
  apy: number;
};

export const createYieldFromApr = (apr: number): Yield => ({
  apr,
  apy: aprToApy(apr),
});

export const createYieldFromApy = (apy: number): Yield => ({
  apr: apyToApr(apy),
  apy,
});

export const borrowLendRatesPrefix = 'bl-rates';

export type BorrowLendRate = {
  tokenAddress: string;
  depositYield: Yield;
  depositedAmount: number;
  borrowYield: Yield;
  borrowedAmount: number;
  utilizationRatio?: number;
  platformId: string;
  poolName: string;
};
