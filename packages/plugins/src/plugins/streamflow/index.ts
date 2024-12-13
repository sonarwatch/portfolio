import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import vestingFetcher from './vestingFetcher';
import {
  airdropFetcherAptos,
  airdropFetcherEthereum,
  airdropFetcherSolana,
  airdropFetcherSui,
} from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [vestingFetcher];
export const airdropFetchers: AirdropFetcher[] = [
  airdropFetcherAptos,
  airdropFetcherEthereum,
  airdropFetcherSolana,
  airdropFetcherSui,
];
