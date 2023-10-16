import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { CrvNetworkId, fooPlatform } from './constants';
import poolsJob from './poolsJob';
import gaugesJob from './gaugesJob';
import { getPoolsPositionFetcher } from './getPoolsPositionFetcher';

export const platforms: Platform[] = [fooPlatform];
export const jobs: Job[] = [poolsJob, gaugesJob];
export const fetchers: Fetcher[] = [
  getPoolsPositionFetcher(CrvNetworkId.ethereum),
  getPoolsPositionFetcher(CrvNetworkId.polygon),
  getPoolsPositionFetcher(CrvNetworkId.avalanche),
];
