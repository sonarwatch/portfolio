import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolFetcher from './poolFetcher';
import poolJob from './poolJob';
import bankFetcher from './bankFetcher';
import positionFetcher from './positionFetcher';
import perpsJob from './perpsJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolJob, perpsJob];
export const fetchers: Fetcher[] = [poolFetcher, bankFetcher, positionFetcher];
