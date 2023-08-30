import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosLpJob from './aptosLpJob';
import { liquidswapPlatform } from './constants';

export const platforms: Platform[] = [liquidswapPlatform];
export const jobs: Job[] = [aptosLpJob];
export const fetchers: Fetcher[] = [];
