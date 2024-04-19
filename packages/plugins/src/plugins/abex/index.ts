import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { abexPlatform } from './constants';
import marketsJob from './marketsJob';
import positionsFetcher from './positionsFetcher';

export const platforms: Platform[] = [abexPlatform];
export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [positionsFetcher];
