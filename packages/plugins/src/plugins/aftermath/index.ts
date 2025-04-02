import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import poolsJob from './poolsJob';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [stakingFetcher];
