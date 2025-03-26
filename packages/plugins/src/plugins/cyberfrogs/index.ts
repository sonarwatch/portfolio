import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsSolanaFetcher from './thorDepositFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [positionsSolanaFetcher];
