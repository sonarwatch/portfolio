import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';
import pairsJob from './pairsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [pairsJob];
export const fetchers: Fetcher[] = [stakingFetcher];
