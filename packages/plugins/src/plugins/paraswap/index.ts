import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import stakingFetcher from './stakingFetcher';
import poolsFetcher from './poolsFetcher';
import bptInfoJob from './bptInfoJob';
import { platform } from './constants';

export const jobs: Job[] = [bptInfoJob];
export const fetchers: Fetcher[] = [stakingFetcher, poolsFetcher];
export const platforms: Platform[] = [platform];
