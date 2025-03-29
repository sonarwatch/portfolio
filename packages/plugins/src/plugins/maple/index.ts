import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import solana from './solanaJob';
import ethereum from './ethereumJob';
import ethereumFetcher from './ethereumFetcher';

export const jobs: Job[] = [solana, ethereum];
export const fetchers: Fetcher[] = [ethereumFetcher];
