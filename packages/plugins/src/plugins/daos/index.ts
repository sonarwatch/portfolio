import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './realmsDepositsFetcher';
import programsJob from './realmsProgramsJob';

export const jobs: Job[] = [programsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
