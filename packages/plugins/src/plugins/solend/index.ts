import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import obligationFetcher from './obligationsFetcher';
import { solendPlatform } from './constants';

export const platforms: Platform[] = [solendPlatform];
export const jobs: Job[] = [marketsJob, reservesJob];
export const fetchers: Fetcher[] = [obligationFetcher];
