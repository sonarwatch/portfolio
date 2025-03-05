import { Platform } from '@sonarwatch/portfolio-core';
import { AirdropFetcher } from '../../AirdropFetcher';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import escrowFetcher from './escrowFetcher';
import stakingFetcher from './stakingFetcher';
import { airdropFetcher } from './airdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [escrowFetcher, stakingFetcher];
export const airdropFetchers: AirdropFetcher[] = [airdropFetcher];
