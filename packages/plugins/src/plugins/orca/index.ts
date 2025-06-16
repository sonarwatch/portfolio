import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';
import whirlpoolsStatsJob from './whirlpoolsStatsJob';

export const jobs: Job[] = [whirlpoolJob, lpJob, whirlpoolsStatsJob];
export const fetchers: Fetcher[] = [];
