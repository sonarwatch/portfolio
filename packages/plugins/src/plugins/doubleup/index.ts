import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import housesJob from './housesAndRedeemJob';
import redeemTicketFetcher from './redeemTicketsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [housesJob];
export const fetchers: Fetcher[] = [redeemTicketFetcher];
