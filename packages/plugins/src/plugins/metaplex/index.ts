import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import resizeNftsFetcher from './resizableNftFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [resizeNftsFetcher];
