import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { curvePoolsApi, platform } from './constants';
import getPoolsJob from './getPoolsJob';
import getPoolsBalancesFetcher from './getPoolsBalancesFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  getPoolsJob(NetworkId.ethereum, platform.id, curvePoolsApi),
];
export const fetchers: Fetcher[] = [
  getPoolsBalancesFetcher(NetworkId.ethereum, platform.id),
];
