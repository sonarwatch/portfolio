import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import { airdropFetcherEvm, airdropFetcherSolana } from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [];
export const airdropFetchers: AirdropFetcher[] = [
  airdropFetcherEvm,
  airdropFetcherSolana,
];
