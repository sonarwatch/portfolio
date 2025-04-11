import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import daosJob from './daosJob';
import launchpadJob from './launchpadJob';
import launchpadFetcher from './launchpadFetcher';

export const jobs: Job[] = [daosJob, launchpadJob];
export const fetchers: Fetcher[] = [launchpadFetcher];
