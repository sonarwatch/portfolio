import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import poolsJob from './poolsJob';
import rewardsFetcher from './rewardsFetcher';

export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [depositsFetcher, rewardsFetcher];
