import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import solana from './solanaJob';
import ethereum from './ethereumJob';
import ethereumFetcher from './ethereumFetcher';
import { platform } from './constants';

export const jobs: Job[] = [solana, ethereum];
export const fetchers: Fetcher[] = [ethereumFetcher];
export const platforms: Platform[] = [platform];
