import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { parclPlatform } from './constants';
import depositsFetcher from './depositsFetcher';
import marginFetcher from './marginFetcher';
import airdropFetcher from './airdropFetcher';

export const platforms: Platform[] = [parclPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [
  depositsFetcher,
  marginFetcher,
  airdropFetcher,
];
