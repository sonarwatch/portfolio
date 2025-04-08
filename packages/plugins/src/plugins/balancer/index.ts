import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { getPoolTokensJob } from './getPoolTokensJob';
import getPoolPositionsFetcher from './getPoolPositionsFetcher';

export const jobs: Job[] = [
  getPoolTokensJob(NetworkId.ethereum),
  getPoolTokensJob(NetworkId.fraxtal),
];

export const fetchers: Fetcher[] = [
  // getPoolPositionsFetcher(NetworkId.ethereum),
  // getPoolPositionsFetcher(NetworkId.avalanche),
  // getPoolPositionsFetcher(NetworkId.polygon),
  getPoolPositionsFetcher(NetworkId.fraxtal),
];
