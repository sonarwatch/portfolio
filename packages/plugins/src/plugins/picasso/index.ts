import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import unstakingNftsJob from './unstakingNftsJob';
import unstakingPositionsFetcher from './unstakingPositionsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [unstakingNftsJob];
export const fetchers: Fetcher[] = [unstakingPositionsFetcher];
