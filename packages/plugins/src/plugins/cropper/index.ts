import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import clmmJob from './clmmJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [clmmJob];
export const fetchers: Fetcher[] = [];
