import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import marketsJob from './marketsJob';
import positionFetcher from './positionFetcher';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [positionFetcher];
