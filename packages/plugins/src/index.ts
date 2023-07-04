import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import { jobs as marinadeJobs, fetchers as marinadeFetchers } from './marinade';
import { jobs as raydiumJobs, fetchers as raydiumFetchers } from './raydium';

export const jobs: Job[] = [...marinadeJobs, ...raydiumJobs];
export const fetchers: Fetcher[] = [...marinadeFetchers, ...raydiumFetchers];
