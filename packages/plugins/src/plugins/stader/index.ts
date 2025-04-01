import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import staderEthereumFetcher from './staderEthereumFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [ staderEthereumFetcher];
