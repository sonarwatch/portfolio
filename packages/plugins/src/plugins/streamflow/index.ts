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
import merkleDistirbutorsJob from './merkleDistirbutorsJob';
import merklesFetcher from './merkleFetcher';

export const jobs: Job[] = [merkleDistirbutorsJob];
export const fetchers: Fetcher[] = [vestingFetcher, merklesFetcher];
export const airdropFetchers: AirdropFetcher[] = [
  airdropFetcherAptos,
  airdropFetcherEthereum,
  airdropFetcherSolana,
  airdropFetcherSui,
];
