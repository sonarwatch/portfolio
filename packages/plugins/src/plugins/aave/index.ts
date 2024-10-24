import { NetworkId, Platform, Service } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
// import lendingPoolsJob from './lendingPoolsJob';
import getLendingFetcherExecutor from './getLendingFetcherExecutor';
import stakingFetcher from './stakingFetcher';
import { platformId, platform } from './constants';
import { lendingV2, lendingV3 } from './services';

export const platforms: Platform[] = [platform];
export const services: Service[] = [lendingV2, lendingV3];
export const jobs: Job[] = [
  // lendingPoolsJob,
];
export const fetchers: Fetcher[] = [
  {
    id: `${platformId}-${NetworkId.ethereum}-lending`,
    networkId: NetworkId.ethereum,
    executor: getLendingFetcherExecutor(NetworkId.ethereum),
  },
  {
    id: `${platformId}-${NetworkId.polygon}-lending`,
    networkId: NetworkId.polygon,
    executor: getLendingFetcherExecutor(NetworkId.polygon),
  },
  {
    id: `${platformId}-${NetworkId.avalanche}-lending`,
    networkId: NetworkId.avalanche,
    executor: getLendingFetcherExecutor(NetworkId.avalanche),
  },
  stakingFetcher,
];
