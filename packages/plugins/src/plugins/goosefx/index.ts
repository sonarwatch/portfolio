import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import liquidityFetcher from './singlePoolFetcher';
import stakingFetcher from './stakingFetcher';
import dualPoolJob from './dualPoolJob';
import dualPoolFetcher from './dualPoolFetcher';

export const jobs: Job[] = [dualPoolJob];
export const fetchers: Fetcher[] = [
  liquidityFetcher,
  stakingFetcher,
  dualPoolFetcher,
];
