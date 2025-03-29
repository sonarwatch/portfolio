import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import lockLpJob from './lockLpJob';
import lockLpFetcher from './lockLpFetcher';

export const jobs: Job[] = [poolsJob, lockLpJob];
export const fetchers: Fetcher[] = [lockLpFetcher];
