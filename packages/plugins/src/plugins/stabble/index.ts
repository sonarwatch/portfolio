import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import stakingFetcher from './stakingFetcher';
import stakedPoolsJob from './stakedPoolsJob';

export const jobs: Job[] = [poolsJob, stakedPoolsJob];
export const fetchers: Fetcher[] = [stakingFetcher];
