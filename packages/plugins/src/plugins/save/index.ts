import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import obligationFetcher from './obligationsFetcher';
import { platform } from './constants';
import rewardsFetcher from './rewardsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketsJob, reservesJob];
export const fetchers: Fetcher[] = [obligationFetcher, rewardsFetcher];
