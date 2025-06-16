import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import clmmJob from './clmmJob';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [clmmJob];
export const fetchers: Fetcher[] = [stakingFetcher];
