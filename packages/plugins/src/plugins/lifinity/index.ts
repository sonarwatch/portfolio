import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lockerFetcher from './lockerFetcher';
import xLfntyJob from './xLfntyJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [xLfntyJob];
export const fetchers: Fetcher[] = [lockerFetcher];
