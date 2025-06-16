import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import clmmJob from './clmmJob';
import stakingFetcher from './stakingFetcher';
import whirlpoolFetcher from './whirlpoolFetcher';

export const jobs: Job[] = [clmmJob];
export const fetchers: Fetcher[] = [stakingFetcher, whirlpoolFetcher];
