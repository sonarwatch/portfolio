import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import gamesFetcher from './gamesFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [gamesFetcher];
