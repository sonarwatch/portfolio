import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { magicEdenPlatform } from './constants';
import escrowFetcher from './escrowFetcher';

export const platforms: Platform[] = [magicEdenPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [escrowFetcher];
