import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import perpetualFetcher from './exchange/perpetualFetcher';
import valueAverageFetcher from './exchange/valueAverageFetcher';
import limitFetcher from './exchange/limitFetcher';
import dcaFetcher from './exchange/dcaFetcher';
import lockFetcher from './exchange/lockFetcher';
import custodiesJob from './exchange/custodiesJob';

import voteFetcher from './governance/voteFetcher';
import pricingJob from './pricingJob';
import { AirdropFetcher } from '../../AirdropFetcher';
import {
  asr1AirdropFetcher,
  asr2AirdropFetcher,
  asr3AirdropFetcher,
  asr4AirdropFetcher,
  asr5AirdropFetcher,
  asr5Fetcher,
} from './governance';
import { lfgAirdropFetchers, lfgFetchers } from './launchpad';
import verifiedJob from './verifiedJob';
import perpetualBorrowFetcher from './exchange/perpetualBorrowFetcher';
import perpetualBorrowJob from './exchange/perpetualBorrowJob';

export const jobs: Job[] = [
  custodiesJob,
  verifiedJob,
  pricingJob,
  perpetualBorrowJob,
];
export const fetchers: Fetcher[] = [
  perpetualFetcher,
  perpetualBorrowFetcher,
  valueAverageFetcher,
  limitFetcher,
  dcaFetcher,
  lockFetcher,
  voteFetcher,
  asr5Fetcher,
  ...lfgFetchers,
];
export const airdropFetchers: AirdropFetcher[] = [
  asr1AirdropFetcher,
  asr2AirdropFetcher,
  asr3AirdropFetcher,
  asr4AirdropFetcher,
  asr5AirdropFetcher,
  ...lfgAirdropFetchers,
];

export const jupFetcherIds = [
  perpetualFetcher.id,
  valueAverageFetcher.id,
  limitFetcher.id,
  dcaFetcher.id,
  voteFetcher.id,
  lockFetcher.id,
];
