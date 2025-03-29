import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import jwlSuiJob from './stakedAssetsPricingJob';
import positionsFetcher from './stakedFetcher';

export const jobs: Job[] = [jwlSuiJob];
export const fetchers: Fetcher[] = [positionsFetcher];
