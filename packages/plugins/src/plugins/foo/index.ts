import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import ammJob from './ammJob';
import positionFetcher from './positionFetcher';

export const jobs: Job[] = [ammJob];
export const fetchers: Fetcher[] = [positionFetcher];
