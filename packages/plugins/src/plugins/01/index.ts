import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositFectcher from './depostisFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositFectcher];
