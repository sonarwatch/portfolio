import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import obligationsFetcher from './obligationsFetcher';
import marketsJob from './marketsJob';
import { airdropFetcher } from './airdropFetcher';
import burnEventJob from './burnEventsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketsJob, burnEventJob];
export const fetchers: Fetcher[] = [obligationsFetcher];

export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
