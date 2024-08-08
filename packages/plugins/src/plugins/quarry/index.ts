import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import positionsFetcher from './positionsFetcher';
import rewardersJob from './rewardersJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [rewardersJob];
export const fetchers: Fetcher[] = [positionsFetcher];
