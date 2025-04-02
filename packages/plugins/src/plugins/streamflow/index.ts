import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import vestingFetcher from './vestingFetcher';
import {
  airdropFetcherAptos,
  airdropFetcherEthereum,
  airdropFetcherSolana,
  airdropFetcherSui,
} from './airdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [vestingFetcher];
export const airdropFetchers: AirdropFetcher[] = [
  airdropFetcherAptos,
  airdropFetcherEthereum,
  airdropFetcherSolana,
  airdropFetcherSui,
];
