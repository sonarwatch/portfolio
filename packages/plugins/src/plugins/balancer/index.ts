import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
// import v2Job from './v2Job';
import getV2Fetcher from './getV2Fetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  /* v2Job */
];
export const fetchers: Fetcher[] = [
  getV2Fetcher(NetworkId.ethereum),
  getV2Fetcher(NetworkId.avalanche),
  getV2Fetcher(NetworkId.polygon),
];
