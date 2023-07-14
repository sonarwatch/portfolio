import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import lpJob from './lpTokensJob';
import whirlpoolJob from './whirlpoolsJob';
import clmmPositionsFetcher from './clmmPositionsFetcher';

export const jobs: Job[] = [lpJob, whirlpoolJob];
export const fetchers: Fetcher[] = [clmmPositionsFetcher];
