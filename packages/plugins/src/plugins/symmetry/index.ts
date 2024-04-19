import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { symmetryPlatform } from './constants';
import basketsJob from './basketsJob';

export const platforms: Platform[] = [symmetryPlatform];
export const jobs: Job[] = [basketsJob];
export const fetchers: Fetcher[] = [];
