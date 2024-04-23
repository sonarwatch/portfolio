import { Platform } from '@sonarwatch/portfolio-core';
// import tensorFetcher from './singleListingFetcher';

import { Fetcher } from '../../Fetcher';
import { platform } from './constants';
import bidsFetcher from './bidsFetcher';
import locksFetcher from './locksFetcher';

export const platforms: Platform[] = [platform];
export const fetchers: Fetcher[] = [bidsFetcher, locksFetcher];
