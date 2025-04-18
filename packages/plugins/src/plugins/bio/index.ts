import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsSolanaFetcher from './depositFetcher';
import boostJob from './tokenStatsJob';

export const jobs: Job[] = [boostJob];
export const fetchers: Fetcher[] = [positionsSolanaFetcher];
