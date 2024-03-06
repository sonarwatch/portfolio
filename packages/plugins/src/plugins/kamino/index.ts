import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { kaminoPlatform } from './constants';
import poolsJob from './poolsJob';
import farmsJob from './farmsJob';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import lendsFetcher from './lendsFetcher';
import farmsFetcher from './farmsFetcher';

export const platforms: Platform[] = [kaminoPlatform];
export const jobs: Job[] = [poolsJob, reservesJob, farmsJob, marketsJob];
export const fetchers: Fetcher[] = [lendsFetcher, farmsFetcher];
