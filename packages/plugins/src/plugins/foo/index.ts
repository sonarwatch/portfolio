import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import marketsJob from './marketsJob';
import {
  airdropFetcher as s1AirdropFetcher,
  fetcher as s1Fetcher,
} from './airdropFetcher';
import positionsSolanaFetcher from './positionsSolanaFetcher';

export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [positionsSolanaFetcher, s1Fetcher];
export { s1AirdropFetcher };
