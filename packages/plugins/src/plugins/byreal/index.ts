import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import clmmJob from './clmmJob';
import resetFetcher from './resetFetcher';

export const jobs: Job[] = [clmmJob];
export const fetchers: Fetcher[] = [resetFetcher];
