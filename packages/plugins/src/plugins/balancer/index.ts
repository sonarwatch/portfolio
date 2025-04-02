import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import getBalancerPoolTokensJob from './getPoolTokensMetadataJob';
import getPoolPositionsFetcher from './getPoolPositionsFetcher';

export const jobs: Job[] = [getBalancerPoolTokensJob];

export const fetchers: Fetcher[] = [
  getPoolPositionsFetcher(NetworkId.ethereum),
  getPoolPositionsFetcher(NetworkId.avalanche),
  getPoolPositionsFetcher(NetworkId.polygon),
  getPoolPositionsFetcher(NetworkId.fraxtal),
];
