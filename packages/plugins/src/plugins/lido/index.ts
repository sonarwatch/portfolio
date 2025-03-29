import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import withdrawlFetcher from './withdrawlFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [withdrawlFetcher];
