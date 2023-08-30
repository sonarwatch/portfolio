import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lpTokensJob from './lpTokensJob';
import { raydiumPlatform } from './constants';

export const platforms: Platform[] = [raydiumPlatform];
export const jobs: Job[] = [lpTokensJob];
export const fetchers: Fetcher[] = [];
