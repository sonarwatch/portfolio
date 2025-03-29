import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import {
  dis1AirdropFetcherEvm,
  dis1AirdropFetcherSolana,
  dis1Fetcher,
  dis2AirdropFetcherEvm,
  dis2AirdropFetcherSolana,
  dis2Fetcher,
} from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import alphaVaultJob from './dlmmVaultsJob';
import alphaVaultFetcher from './dlmmVaultsFetcher';

export const jobs: Job[] = [alphaVaultJob];
export const fetchers: Fetcher[] = [
  alphaVaultFetcher,
  dis1Fetcher,
  dis2Fetcher,
];
export const airdropFetchers: AirdropFetcher[] = [
  dis1AirdropFetcherEvm,
  dis1AirdropFetcherSolana,
  dis2AirdropFetcherEvm,
  dis2AirdropFetcherSolana,
];
