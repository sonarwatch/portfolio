import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import pricingJob from './pricingJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [pricingJob];
export const fetchers: Fetcher[] = [];
