import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosJob from './aptosLpJob';
import { pancakeswapPlatform } from './constants';

export const platforms: Platform[] = [pancakeswapPlatform];
export const jobs: Job[] = [aptosJob];
export const fetchers: Fetcher[] = [];
