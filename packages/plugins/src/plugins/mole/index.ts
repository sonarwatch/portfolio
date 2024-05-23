import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import depositsFetcher from './depositsFetcher';
import farmsFetcher from './farmsFetcher';
import farmsJob from './farmsJob';
import dataJob from './dataJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [dataJob, farmsJob];
export const fetchers: Fetcher[] = [depositsFetcher, farmsFetcher];
