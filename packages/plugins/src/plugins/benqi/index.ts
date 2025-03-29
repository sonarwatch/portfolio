import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { comptroller, platformId } from './constants';
import getMarketsV2Job from '../compound/getMarketsV2Job';
import getPositionsV2Fetcher from '../compound/getPositionsV2Fetcher';

export const jobs: Job[] = [
  getMarketsV2Job(NetworkId.avalanche, platformId, comptroller),
];
export const fetchers: Fetcher[] = [
  getPositionsV2Fetcher(NetworkId.avalanche, platformId),
];
