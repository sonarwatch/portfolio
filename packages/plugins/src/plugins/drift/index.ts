import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import spotMarketsJob from './spotMarketsJob';
import prepMarketsJob from './prepMarketsJob';
import depositsFetcher from './depositsFetcher';
import premarketJob from './premarketJob';
import driftAirdropFetcher from './airdropFetcher';
import { airdropFetcher } from './helpersAirdrop';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [spotMarketsJob, premarketJob, prepMarketsJob];
export const fetchers: Fetcher[] = [depositsFetcher, driftAirdropFetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
