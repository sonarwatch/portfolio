import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsFetcher from './positionsFetcher';
import rewardersJob from './rewardersJob';
import redeemersJob from './redeemersJob';

export const jobs: Job[] = [rewardersJob, redeemersJob];
export const fetchers: Fetcher[] = [positionsFetcher];
