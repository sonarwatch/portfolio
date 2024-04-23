import { Platform } from '@sonarwatch/portfolio-core';
import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';
import { platform } from './constants';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [whirlpoolJob, lpJob];
export const fetchers: Fetcher[] = [];
