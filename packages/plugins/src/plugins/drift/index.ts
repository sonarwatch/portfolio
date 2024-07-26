import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import spotMarketsJob from './spotMarketsJob';
import prepMarketsJob from './prepMarketsJob';
import depositsFetcher from './depositsFetcher';
import premarketJob from './premarketJob';
// import airdropFetcher from './airdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [spotMarketsJob, premarketJob, prepMarketsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
export { airdropFetcher } from './helpersAirdrop';
