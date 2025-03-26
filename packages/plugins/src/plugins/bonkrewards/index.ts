import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionFetcher from './positionFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [positionFetcher];
