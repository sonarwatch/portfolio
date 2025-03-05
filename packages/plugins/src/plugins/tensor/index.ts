import { Platform } from '@sonarwatch/portfolio-core';
// import tensorFetcher from './singleListingFetcher';

import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import { platform } from './constants';
import bidsFetcher from './bidsFetcher';
// import powerUserAirdropFetcher from './airdropPowerUsersFetcher';
import sharedEscrowFetcher from './sharedEscrowFetcher';
import {
  powerUserFetcher,
  powerUserAirdropFetcher,
} from './powerUserAirdropFetcher';
import { s4Fetcher, airdropS4Fetcher } from './season4AirdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';

export const platforms: Platform[] = [platform];
export const fetchers: Fetcher[] = [
  bidsFetcher,
  powerUserFetcher,
  s4Fetcher,
  sharedEscrowFetcher,
];

export const airdropFetchers: AirdropFetcher[] = [
  powerUserAirdropFetcher,
  airdropS4Fetcher,
];

export const jobs: Job[] = [];
