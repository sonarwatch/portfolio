import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import obligationsFetcher from './obligationsFetcher';
import marketsJob from './marketsJob';
import { airdropFetcher } from './airdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [obligationsFetcher];
export { airdropFetcher };
