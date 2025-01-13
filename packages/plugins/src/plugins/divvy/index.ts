import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import houseJob from './houseJob';
import housePoolFetcher from './housePoolFetcher';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [houseJob];
export const fetchers: Fetcher[] = [housePoolFetcher, stakingFetcher];
