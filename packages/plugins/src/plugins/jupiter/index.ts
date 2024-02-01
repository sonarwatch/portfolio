import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import poolJob from './poolJob';
import perpetualFetcher from './perpetualFetcher';
import custodiesJob from './custodiesJob';
import airdropFetcher from './airdropFetcher';

export const jobs: Job[] = [poolJob, custodiesJob];
export const fetchers: Fetcher[] = [perpetualFetcher, airdropFetcher];
