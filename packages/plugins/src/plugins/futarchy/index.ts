import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import daosJob from './daosJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [daosJob];
export const fetchers: Fetcher[] = [];
