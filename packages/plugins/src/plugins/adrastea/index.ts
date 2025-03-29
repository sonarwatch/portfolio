import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import positionsJob from './positionsJob';
import positionsFetcher from './positionsFetcher';
import lrtsSolJob from './lrtsSolJob';

export const jobs: Job[] = [positionsJob, lrtsSolJob];
export const fetchers: Fetcher[] = [positionsFetcher];
