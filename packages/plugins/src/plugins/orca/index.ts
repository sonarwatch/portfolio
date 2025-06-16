import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';
import whirlpoolsStatsJob from './whirlpoolsStatsJob';
import whirlpoolFetcher from './whirlpoolFetcher';

export const jobs: Job[] = [whirlpoolJob, lpJob, whirlpoolsStatsJob];
export const fetchers: Fetcher[] = [whirlpoolFetcher];
