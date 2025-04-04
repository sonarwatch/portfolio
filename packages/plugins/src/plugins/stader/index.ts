import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import staderStakingEthereumFetcher from './staderStakingEthereumFetcher';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [staderStakingEthereumFetcher];
