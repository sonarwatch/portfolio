import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import ammJob from './ammJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [ammJob];
export const fetchers: Fetcher[] = [];
