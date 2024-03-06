import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import perpetualFetcher from './perpetualFetcher';
import custodiesJob from './custodiesJob';
import airdropFetcher from './airdropFetcher';
import voteFetcher from './voteFetcher';

export const jobs: Job[] = [custodiesJob];
export const fetchers: Fetcher[] = [
  perpetualFetcher,
  airdropFetcher,
  voteFetcher,
];
