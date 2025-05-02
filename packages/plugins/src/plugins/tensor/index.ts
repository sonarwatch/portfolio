// import tensorFetcher from './singleListingFetcher';

import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import bidsFetcher from './bidsFetcher';
// import powerUserAirdropFetcher from './airdropPowerUsersFetcher';
import sharedEscrowFetcher from './sharedEscrowFetcher';
import {
  powerUserFetcher,
  powerUserAirdropFetcher,
} from './powerUserAirdropFetcher';
import { s4Fetcher, airdropS4Fetcher } from './season4AirdropFetcher';
import { AirdropFetcher } from '../../AirdropFetcher';
import topNftCollectionJob from './topNftCollectionJob';

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

export const jobs: Job[] = [topNftCollectionJob];
