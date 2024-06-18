import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import offersFetcher from './offersFetcher';
import airdropFetcher from './airdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [];
export const fetchers: Fetcher[] = [offersFetcher, airdropFetcher];
