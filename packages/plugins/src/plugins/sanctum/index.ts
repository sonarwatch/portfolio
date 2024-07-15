import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import lstsJob from './lstsJob';
import airdropFetcher from './airdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lstsJob];
export const fetchers: Fetcher[] = [];
export { airdropFetcher };
