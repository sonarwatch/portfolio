import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import rewardsFetcher from './creatorRewardsFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [rewardsFetcher];
