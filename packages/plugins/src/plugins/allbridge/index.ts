import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsFetcher from './positionsFetcher';
import poolsJob from './poolsJob';

export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [positionsFetcher];
