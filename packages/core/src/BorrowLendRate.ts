import { Yield } from './Yield';

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
