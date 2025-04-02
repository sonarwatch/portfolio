import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsFetcher from './positionsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [positionsFetcher];
