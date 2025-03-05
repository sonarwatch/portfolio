import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import stakingFetcher from './stakingFetcher';
import { s1AirdropFetcher, s1Fetcher } from './airdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [stakingFetcher, s1Fetcher];

export const airdropFetchers: AirdropFetcher[] = [s1AirdropFetcher];
