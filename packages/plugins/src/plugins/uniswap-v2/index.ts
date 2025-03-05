import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
// import { NetworkId } from '@sonarwatch/portfolio-core';
// import { theGraphUrl } from './constants';
// import getPoolsJob from './getPoolsJob';
// import { platformId } from '../uniswap/constants';
// import getPositionsV2Fetcher from './getPositionsV2Fetcher';

export const jobs: Job[] = [
  // getPoolsJob(NetworkId.ethereum, platformId, 'V2', theGraphUrl),
];
export const fetchers: Fetcher[] = [
  // getPositionsV2Fetcher(NetworkId.ethereum, platformId, 'V2'),
];

export const platforms: Platform[] = [];
