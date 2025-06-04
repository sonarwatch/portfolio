import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionFetcher from './positionFetcher';
import stakingPoolsJob from './stakingPoolsJob';

export const jobs: Job[] = [stakingPoolsJob];
export const fetchers: Fetcher[] = [positionFetcher];
