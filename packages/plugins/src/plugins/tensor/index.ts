import { Platform } from '@sonarwatch/portfolio-core';
// import tensorFetcher from './singleListingFetcher';

import { Fetcher } from '../../Fetcher';
import { tensorPlatform } from './constants';
import bidsFetcher from './bidsFetcher';
import locksFetcher from './locksFetcher';

export const platforms: Platform[] = [tensorPlatform];
export const fetchers: Fetcher[] = [bidsFetcher, locksFetcher];
