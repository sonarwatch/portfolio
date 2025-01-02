import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { kyrosPlatform, platform, renzoPlatform } from './constants';
import aidropFetcher from './airdropFetcher';
import vaultsJob from './vaultsJob';
import ticketFetcher from './ticketFetcher';

export const platforms: Platform[] = [platform, renzoPlatform, kyrosPlatform];
export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [aidropFetcher, ticketFetcher];
