import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import obligationFetcher from './obligationsFetcher';

export const jobs: Job[] = [reservesJob, marketsJob];
export const fetchers: Fetcher[] = [obligationFetcher];
