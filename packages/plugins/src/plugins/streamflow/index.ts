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
import stakePoolJob from './stakePoolsJob';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [merkleDistirbutorsJob, stakePoolJob];
export const fetchers: Fetcher[] = [
  vestingFetcher,
  merklesFetcher,
  stakingFetcher,
];
export const airdropFetchers: AirdropFetcher[] = [
  airdropFetcherAptos,
  airdropFetcherEthereum,
  airdropFetcherSolana,
  airdropFetcherSui,
];
