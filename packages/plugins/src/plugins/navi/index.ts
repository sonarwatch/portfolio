import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import reserveJob from './reservesJob';
import collateralFetcher from './collateralFetcher';
import { platform } from './constants';

export const jobs: Job[] = [reserveJob];
export const fetchers: Fetcher[] = [collateralFetcher];
export const platforms: Platform[] = [platform];
