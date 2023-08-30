import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import lpSeiJob from './lpSeiJob';
import lpSeiFetcher from './lpSeiFetcher';
import { astroportPlatform } from './constants';

export const platforms: Platform[] = [astroportPlatform];
export const jobs: Job[] = [lpSeiJob];
export const fetchers: Fetcher[] = [lpSeiFetcher];
