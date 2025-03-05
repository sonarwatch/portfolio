import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './depositsFetcher';
import { airdropFetcher, fetcher } from './airdropFetcher';
import stakingFetcher from './stakingFetcher';
import { platform } from './constants';

export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [depositsFetcher, fetcher, stakingFetcher];
export const platforms: Platform[] = [platform];

export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
