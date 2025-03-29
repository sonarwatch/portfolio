import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import poolJob from './poolJob';
import stakingPoolJob from './stakingPoolJob';
import stakingPoolFetcher from './stakingPoolFetcher';
import stakingPoolV3Fetcher from './stakingPoolV3Fetcher';

export const jobs: Job[] = [poolJob, stakingPoolJob];
export const fetchers: Fetcher[] = [
  stakingFetcher,
  stakingPoolFetcher,
  stakingPoolV3Fetcher,
];
