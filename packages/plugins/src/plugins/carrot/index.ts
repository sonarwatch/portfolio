import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import banksJob from './banksJob';
import depositsFetcher from './depositsFetcher';
import crtYieldJob from './crtYieldJob';

export const jobs: Job[] = [banksJob, crtYieldJob];
export const fetchers: Fetcher[] = [depositsFetcher];
