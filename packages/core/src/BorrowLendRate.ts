import { Yield } from './Yield';

export const borrowLendRatesPrefix = 'bl-rates';

/**
 * Represents a yield information with APR and APY (as fraction).
 * If negative, it means that it costs money to hold the asset.
 */

export type BorrowLendRate = {
  /**
   * Id of the platform where the yields are available.
   */
  platformId: string;
  /**
   * Token address of the asset for which yields are available.
   */
  tokenAddress: string;
  /**
   * Yield information for the deposited amount.
   */
  depositYield: Yield;
  /**
   * Amount deposited in the pool
   */
  depositedAmount: number;
  /**
   * Yield information for the borrowed amount.
   */
  borrowYield: Yield;
  /**
   * Amount borrowed from the pool
   */
  borrowedAmount: number;
  /**
   * Utilization ratio of the pool.
   */
  utilizationRatio?: number;
  /**
   * Name of the pool.
   */
  poolName?: string;
  /**
   * Duration in ms for fixed duration loans.
   */
  duration?: number;
  /**
   * Reference of the onchain account if it exist.
   */
  ref?: string;
};
