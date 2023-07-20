import vaultsJob from './vaultsJob';
import poolsJob from './poolsJob';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';

export const jobs: Job[] = [vaultsJob, poolsJob];
export const fetchers: Fetcher[] = [];
