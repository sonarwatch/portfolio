import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import marginFetcher from './marginFetcher';
import stakingFetcher from './stakingFetcher';
import { airdropFetcher } from './helpersAirdrop';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  depositsFetcher,
  marginFetcher,
  stakingFetcher,
  // airdropFetcher,
];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
