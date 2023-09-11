import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reserveJob from './reservesJob';
import collateralFetcher from './collateralFetcher';

export const jobs: Job[] = [reserveJob];
export const fetchers: Fetcher[] = [collateralFetcher];
