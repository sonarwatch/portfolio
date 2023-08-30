import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import aptosLpJob from './aptosLpJob';
import { auxExchangePlatform } from './constants';

export const platforms: Platform[] = [auxExchangePlatform];
export const jobs: Job[] = [aptosLpJob];
export const fetchers: Fetcher[] = [];
