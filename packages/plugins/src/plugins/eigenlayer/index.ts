import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import positionsFetcher from './positionsFetcher';

export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [positionsFetcher];
