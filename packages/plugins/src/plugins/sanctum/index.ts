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
import { asrAirdropFetcher, asrFetcher } from './asrAirdropFetcher';
import lstsPricingJob from './lstsPricingJob';

export const jobs: Job[] = [lstsPricingJob];
export const fetchers: Fetcher[] = [
  s1Fetcher,
  nclbFetcher,
  stakingFetcher,
  asrFetcher,
];
export const airdropFetchers: AirdropFetcher[] = [
  s1AirdropFetcher,
  nclbAirdropFetcher,
  asrAirdropFetcher,
];
