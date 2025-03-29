import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import lockerFetcher from './lockerFetcher';
import xLfntyJob from './xLfntyJob';

export const jobs: Job[] = [xLfntyJob];
export const fetchers: Fetcher[] = [lockerFetcher];
