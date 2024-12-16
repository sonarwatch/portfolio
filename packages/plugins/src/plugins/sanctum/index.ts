import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lstsJob from './lstsJob';
import {
  airdropFetcher as s1AirdropFetcher,
  fetcher as s1Fetcher,
} from './s1AirdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import {
  airdropFetcher as nclbAirdropFetcher,
  fetcher as nclbFetcher,
} from './nclbAirdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lstsJob];
export const fetchers: Fetcher[] = [s1Fetcher, nclbFetcher];
export const airdropFetchers: AirdropFetcher[] = [
  s1AirdropFetcher,
  nclbAirdropFetcher,
];
