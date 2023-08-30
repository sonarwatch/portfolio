import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import fetcher from './fetcherFetcher';
import { meeiroPlatform } from './constants';

export const platforms: Platform[] = [meeiroPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [fetcher];
