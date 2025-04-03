import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import spotMarketsJob from './spotMarketsJob';
import perpMarketsJob from './perpMarketsJob';
import depositsFetcher from './depositsFetcher';
import premarketJob from './premarketJob';
import driftAirdropFetcher from './airdropFetcher';
import { airdropFetcher } from './helpersAirdrop';

export const jobs: Job[] = [spotMarketsJob, premarketJob, perpMarketsJob];
export const fetchers: Fetcher[] = [depositsFetcher, driftAirdropFetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
