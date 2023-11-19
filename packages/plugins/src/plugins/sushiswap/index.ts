import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  avalancheTheGraphV2,
  bnbTheGraphV2,
  ethereumTheGraphV2,
  platform,
  polygonTheGraphV2,
} from './constants';
import getPoolsJob from '../uniswap-v2/getPoolsJob';
import getPositionsV2Fetcher from '../uniswap-v2/getPositionsV2Fetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  getPoolsJob(NetworkId.ethereum, platform.id, 'v2', ethereumTheGraphV2),
  getPoolsJob(NetworkId.polygon, platform.id, 'v2', polygonTheGraphV2),
  getPoolsJob(NetworkId.avalanche, platform.id, 'v2', avalancheTheGraphV2),
  getPoolsJob(NetworkId.bnb, platform.id, 'v2', bnbTheGraphV2),
];
export const fetchers: Fetcher[] = [
  getPositionsV2Fetcher(NetworkId.ethereum, platform.id, 'v2'),
  getPositionsV2Fetcher(NetworkId.polygon, platform.id, 'v2'),
  getPositionsV2Fetcher(NetworkId.avalanche, platform.id, 'v2'),
  getPositionsV2Fetcher(NetworkId.bnb, platform.id, 'v2'),
];
