import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import vaultsJob from './vaultsJob';
import positionsFetcher from './positionsFetcher';

export const jobs: Job[] = [vaultsJob];
export const fetchers: Fetcher[] = [positionsFetcher];
