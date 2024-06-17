import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import depositFetcher from './depositFetcher';
import tokensJob from './tokensJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [tokensJob];
export const fetchers: Fetcher[] = [depositFetcher];
