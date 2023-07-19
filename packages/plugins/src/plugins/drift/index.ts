import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import spotMarketsJob from './spotMarketsJob';
import spotPositionsFetcher from './spotPositionsFetcher';

export const jobs: Job[] = [spotMarketsJob];
export const fetchers: Fetcher[] = [spotPositionsFetcher];
