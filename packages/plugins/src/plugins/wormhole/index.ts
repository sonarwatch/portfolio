import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import legacyStakingFetcher from './legacyStakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [legacyStakingFetcher, stakingFetcher];
