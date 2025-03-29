import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolsJob from './poolsJob';
import depositFetcher from './depositFetcher';

export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [depositFetcher];
