import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositFetcher from './depositFetcher';
import tokensJob from './tokensJob';

export const jobs: Job[] = [tokensJob];
export const fetchers: Fetcher[] = [depositFetcher];
