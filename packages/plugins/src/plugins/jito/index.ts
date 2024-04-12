import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { jitoPlatform } from './constants';
import aidropFetcher from './airdropFetcher';

export const platforms: Platform[] = [jitoPlatform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [aidropFetcher];
