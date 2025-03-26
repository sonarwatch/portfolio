import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import banksJob from './banksJob';
import boostBanksJob from './boostBanksJob';
import groupsJob from './groupsJob';
import collateralFetcher from './collateralFetcher';
import boostFetcher from './boostFetcher';

export const jobs: Job[] = [banksJob, groupsJob, boostBanksJob];
export const fetchers: Fetcher[] = [collateralFetcher, boostFetcher];
