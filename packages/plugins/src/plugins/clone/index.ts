import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
// import depositsFetcher from './depositsFetcher';
// import poolsJob from './poolsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  // poolsJob,
];
export const fetchers: Fetcher[] = [
  // depositsFetcher,
];
