import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import collateralFetcher from './collateralFetcher';
import sbuckJob from './sbuckJob';
import stakingFetcher from './stakingFetcher';
import bucketsJob from './bucketsJob';

export const jobs: Job[] = [sbuckJob, bucketsJob];
export const fetchers: Fetcher[] = [collateralFetcher, stakingFetcher];
