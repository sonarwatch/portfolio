import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  airdropFetcher as s1AirdropFetcher,
  fetcher as s1Fetcher,
} from './s1AirdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import {
  airdropFetcher as nclbAirdropFetcher,
  fetcher as nclbFetcher,
} from './nclbAirdropFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [s1Fetcher, nclbFetcher, stakingFetcher];
export const airdropFetchers: AirdropFetcher[] = [
  s1AirdropFetcher,
  nclbAirdropFetcher,
];
