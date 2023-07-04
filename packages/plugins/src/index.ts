import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import { jobs as wallettokensJobs } from './plugins/wallettokens';
import {
  jobs as marinadeJobs,
  fetchers as marinadeFetchers,
} from './plugins/marinade';
import {
  jobs as raydiumJobs,
  fetchers as raydiumFetchers,
} from './plugins/raydium';

export const jobs: Job[] = [
  ...marinadeJobs,
  ...raydiumJobs,
  ...wallettokensJobs,
];
export const fetchers: Fetcher[] = [...marinadeFetchers, ...raydiumFetchers];
