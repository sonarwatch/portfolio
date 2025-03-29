import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import poolsFetcher from './poolsFetcher';
import bptInfoJob from './bptInfoJob';

export const jobs: Job[] = [bptInfoJob];
export const fetchers: Fetcher[] = [stakingFetcher, poolsFetcher];
