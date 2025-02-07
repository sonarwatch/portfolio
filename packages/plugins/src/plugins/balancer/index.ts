import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import getBalancerPoolTokensJob from './getBalancerPoolTokensJob';
import getV2Fetcher from './getV2Fetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [getBalancerPoolTokensJob];
export const fetchers: Fetcher[] = [
  // getV2Fetcher(NetworkId.ethereum),
  // getV2Fetcher(NetworkId.avalanche),
  // getV2Fetcher(NetworkId.polygon),
  getV2Fetcher(NetworkId.fraxtal),
];
