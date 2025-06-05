import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lockerFetcher from './lockerFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [lockerFetcher];
