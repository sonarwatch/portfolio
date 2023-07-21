import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import banksJob from './banksJob';
import collateralFetcher from './collateralFetcher';

export const jobs: Job[] = [banksJob];
export const fetchers: Fetcher[] = [collateralFetcher];
