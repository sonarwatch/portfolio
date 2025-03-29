import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import housesJob from './housesAndRedeemJob';
import redeemTicketFetcher from './redeemTicketsFetcher';

export const jobs: Job[] = [housesJob];
export const fetchers: Fetcher[] = [redeemTicketFetcher];
