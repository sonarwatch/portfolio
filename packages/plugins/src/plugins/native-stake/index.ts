import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import suiFetcher from './suiFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [suiFetcher];
