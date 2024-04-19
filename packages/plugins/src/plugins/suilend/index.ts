import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { suilendPlatform } from './constants';
import obligationsFetcher from './obligationsFetcher';
import marketsJob from './marketsJob';

export const platforms: Platform[] = [suilendPlatform];
export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [obligationsFetcher];
