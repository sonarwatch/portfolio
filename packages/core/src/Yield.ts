import { aprToApy, apyToApr } from './utils';

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
