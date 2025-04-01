import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import withdrawlFetcher from './withdrawlFetcher';
import stakedFetcher from './stakedFetcher';
import nftStakedFetcher from './nftStakedFetcher';
import getCSMJob from './CSMjob';
import { platformId } from './constants';

export const jobs: Job[] = [getCSMJob(platformId)];
export const fetchers: Fetcher[] = [
  withdrawlFetcher,
  stakedFetcher,
  nftStakedFetcher,
];
