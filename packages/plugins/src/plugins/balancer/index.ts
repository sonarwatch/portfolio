import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsJob from './poolsJob';
import getPoolsV2Fetcher from './getPoolsV2Fetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [
  getPoolsV2Fetcher(NetworkId.ethereum),
  getPoolsV2Fetcher(NetworkId.avalanche),
  getPoolsV2Fetcher(NetworkId.polygon),
];
