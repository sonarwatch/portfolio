import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lendingJob from './lendingJob';
import lendingFetcher from './lendingFetcher';
import strategyFetcher from './strategyFetcher';
import strategyJob from './strategyJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lendingJob, strategyJob];
export const fetchers: Fetcher[] = [lendingFetcher, strategyFetcher];
