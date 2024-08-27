import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import obligationFetcher from './obligationsFetcher';
import { platform } from './constants';
import rewardsFetcher from './rewardsFetcher';
import rewardStatsJob from './rewardStatsJob';
import token2022wrapperJob from './token2022wrapperJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [
  marketsJob,
  reservesJob,
  rewardStatsJob,
  token2022wrapperJob,
];
export const fetchers: Fetcher[] = [obligationFetcher, rewardsFetcher];
