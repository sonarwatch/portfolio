import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import stakingFetcher from './stakingFetcher';
import getLendingFetcher from './getLendingFetcher';
import { aave2PlatformId, aave3PlatformId } from './constants';
import lendingPoolsJob from './lendingPoolsJob';
import lendingPoolsJobV3 from './lendingPoolsJobV3';
import yieldJob from './yieldJob';
import getYieldFetcher from './yieldFetcher';

export const jobs: Job[] = [lendingPoolsJob, lendingPoolsJobV3, yieldJob];
export const fetchers: Fetcher[] = [
  // v2
  getLendingFetcher(NetworkId.ethereum, aave2PlatformId, 2),
  getLendingFetcher(NetworkId.polygon, aave2PlatformId, 2),
  getLendingFetcher(NetworkId.avalanche, aave2PlatformId, 2),

  // v3 (has lending and yield pools)
  getLendingFetcher(NetworkId.ethereum, aave3PlatformId, 3),
  getYieldFetcher(NetworkId.ethereum),

  getLendingFetcher(NetworkId.polygon, aave3PlatformId, 3),
  getYieldFetcher(NetworkId.polygon),

  getLendingFetcher(NetworkId.avalanche, aave3PlatformId, 3),
  getYieldFetcher(NetworkId.avalanche),

  // staking
  stakingFetcher,
];
