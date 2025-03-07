import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import topTokensJob from './topTokensJob';

export const jobs: Job[] = [topTokensJob];
export const platforms: Platform[] = [];
export const fetchers: Fetcher[] = [];
