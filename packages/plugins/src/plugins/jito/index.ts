import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import vaultsJob from './vaultsJob';
import ticketFetcher from './ticketFetcher';
import { jitoAirdropFetcher } from './airdropFetcher';

export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [
  // aidropFetcher
  ticketFetcher,
];
export const airdropFetchers = [jitoAirdropFetcher];
