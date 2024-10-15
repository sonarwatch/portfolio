import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import { airdropFetcherEvm, airdropFetcherSolana } from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import alphaVaultJob from './dlmmVaultsJob';
import alphaVaultFetcher from './dlmmVaultsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [alphaVaultJob];
export const fetchers: Fetcher[] = [alphaVaultFetcher];
export const airdropFetchers: AirdropFetcher[] = [
  airdropFetcherEvm,
  airdropFetcherSolana,
];
