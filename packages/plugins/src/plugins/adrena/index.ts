import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import custodiesJob from './custodiesJob';
import alpPriceJob from './alpPriceJob';
import positionsFetcher from './positionsFetcher';
import stakingFetcher from './stakingFetcher';

export const jobs: Job[] = [custodiesJob, alpPriceJob];
export const fetchers: Fetcher[] = [positionsFetcher, stakingFetcher];
