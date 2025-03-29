import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import houseJob from './houseJob';
import housePoolFetcher from './housePoolFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [houseJob];
export const fetchers: Fetcher[] = [housePoolFetcher, stakingFetcher];
