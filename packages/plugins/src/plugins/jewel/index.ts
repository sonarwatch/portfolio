import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import jwlSuiJob from './stakedAssetsPricingJob';
import positionsFetcher from './stakedFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [jwlSuiJob];
export const fetchers: Fetcher[] = [positionsFetcher];
