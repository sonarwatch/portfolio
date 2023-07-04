import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import {
  jobs as marinadeJobs,
  fetchers as marinadeFetchers,
} from './plugins/marinade';
import {
  jobs as raydiumJobs,
  fetchers as raydiumFetchers,
} from './plugins/raydium';

export const jobs: Job[] = [...marinadeJobs, ...raydiumJobs];
export const fetchers: Fetcher[] = [...marinadeFetchers, ...raydiumFetchers];
