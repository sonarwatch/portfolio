import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { streamflowPlatform } from './constants';
import vestingFetcher from './vestingFetcher';

export const platforms: Platform[] = [streamflowPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [vestingFetcher];
