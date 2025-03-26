import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import aidropFetcher from './airdropFetcher';
import vaultsJob from './vaultsJob';
import ticketFetcher from './ticketFetcher';

export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [aidropFetcher, ticketFetcher];
