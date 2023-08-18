import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';

export const jobs: Job[] = [whirlpoolJob, lpJob];
export const fetchers: Fetcher[] = [];
