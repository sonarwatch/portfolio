import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import getMarketsV2Job from '../compound/getMarketsV2Job';
import { comptrollerVenus, platformId } from './constants';
import getPositionsV2Fetcher from '../compound/getPositionsV2Fetcher';

export const jobs: Job[] = [
  getMarketsV2Job(NetworkId.bnb, platformId, comptrollerVenus),
];
export const fetchers: Fetcher[] = [
  getPositionsV2Fetcher(NetworkId.bnb, platformId),
];
