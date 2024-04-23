import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensJob from './lpTokensJob';
import clmmJob from './clmmJob';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lpTokensJob, clmmJob];
export const fetchers: Fetcher[] = [stakingFetcher];
