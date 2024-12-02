import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import custodiesJob from './custodiesJob';
import alpPriceJob from './alpPriceJob';
import positionsFetcher from './positionsFetcher';
import stakingFetcher from './stakingFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [custodiesJob, alpPriceJob];
export const fetchers: Fetcher[] = [positionsFetcher, stakingFetcher];
