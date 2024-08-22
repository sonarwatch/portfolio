import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import xStakingJob from './stakingJob';

export const platforms: Platform[] = [];
export const jobs: Job[] = [xStakingJob];
export const fetchers: Fetcher[] = [];
