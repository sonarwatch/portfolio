import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import withdrawlFetcher from './withdrawlFetcher';
import stakedFetcher from './stakedFetcher';
import nftStakedFetcher from './nftStakedFetcher';
import getCSMJob from './CSMjob';

export const jobs: Job[] = [getCSMJob()];
export const fetchers: Fetcher[] = [
  withdrawlFetcher,
  stakedFetcher,
  nftStakedFetcher,
];
