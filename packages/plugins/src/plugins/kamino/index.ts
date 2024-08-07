import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import poolsJob from './poolsJob';
import farmsJob from './farmsJob';
import reservesJob from './reservesJob';
import marketsJob from './marketsJob';
import lendsFetcher from './lendsFetcher';
import farmsFetcher from './farmsFetcher';
import {
  airdropFetcher as s2AirdropFetcher,
  fetcher as s2Fetcher,
} from './airdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [poolsJob, reservesJob, farmsJob, marketsJob];
export const fetchers: Fetcher[] = [lendsFetcher, farmsFetcher, s2Fetcher];
export const airdropFetchers: AirdropFetcher[] = [s2AirdropFetcher];
