import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import spotMarketsJob from './spotMarketsJob';
import spotPositionsFetcher from './deposits';
import premarketJob from './premarketJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [spotMarketsJob, premarketJob];
export const fetchers: Fetcher[] = [spotPositionsFetcher];
