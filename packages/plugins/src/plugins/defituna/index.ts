import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lendingFetcher from './lendingFetcher';
import lendingPoolsJob from './lendingPoolsJob';
import positionsFetcher from './positionsFetcher';
import { tunaAirdropFetcher } from './airdropFetcher';

export const jobs: Job[] = [lendingPoolsJob];
export const fetchers: Fetcher[] = [lendingFetcher, positionsFetcher];
export const airdropFetchers: AirdropFetcher[] = [tunaAirdropFetcher];
