import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositFetcher from './depositFetcher';
import poolsJob from './poolsJob';

export const jobs: Job[] = [poolsJob];
export const fetchers: Fetcher[] = [depositFetcher];
