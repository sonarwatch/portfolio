import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import lpSeiJob from './lpSeiJob';
import lpSeiFetcher from './lpSeiFetcher';

export const jobs: Job[] = [lpSeiJob];
export const fetchers: Fetcher[] = [lpSeiFetcher];
