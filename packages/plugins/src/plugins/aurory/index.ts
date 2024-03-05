import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';
import xAuryJob from './stakingJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [xAuryJob];
export const fetchers: Fetcher[] = [stakingFetcher];
