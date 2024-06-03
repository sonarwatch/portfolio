import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import gamesJob from './gamesJob';
import gamesFetcher from './gamesFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [gamesJob];
export const fetchers: Fetcher[] = [gamesFetcher];
