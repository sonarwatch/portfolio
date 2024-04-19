import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import collateralFetcher from './collateralFetcher';
import { platform } from './constants';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [collateralFetcher];
export const platforms: Platform[] = [platform];
