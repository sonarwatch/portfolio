import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import marketsJob from './marketsJob';
import positionFetcher from './positionFetcher';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [positionFetcher];
