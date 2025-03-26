import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import claimFetcher from './airdropClaimFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [claimFetcher];
