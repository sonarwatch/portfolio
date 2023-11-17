import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import getMarketsV2Job from '../compound/getMarketsV2Job';
import { comptrollerVenus, platformId, venusPlatform } from './constants';
import getPositionsV2Fetcher from '../compound/getPositionsV2Fetcher';

export const jobs: Job[] = [
  getMarketsV2Job(platformId, NetworkId.bnb, comptrollerVenus),
];
export const fetchers: Fetcher[] = [
  getPositionsV2Fetcher(platformId, NetworkId.bnb),
];
export const platforms: Platform[] = [venusPlatform];
