import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensSeiJob from './lpTokensSeiJob';
import lpSeiFetcher from './lpSeiFetcher';

export const jobs: Job[] = [lpTokensSeiJob];
export const fetchers: Fetcher[] = [lpSeiFetcher];
