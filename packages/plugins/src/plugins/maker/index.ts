import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import sdaiJob from './sdaiJob';
import { makerPlatform } from './constants';

export const platforms: Platform[] = [makerPlatform];
export const jobs: Job[] = [sdaiJob];
export const fetchers: Fetcher[] = [];
