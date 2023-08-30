import { Platform } from '@sonarwatch/portfolio-core';
import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';
import { orcaPlatform } from './constants';

export const platforms: Platform[] = [orcaPlatform];
export const jobs: Job[] = [whirlpoolJob, lpJob];
export const fetchers: Fetcher[] = [];
