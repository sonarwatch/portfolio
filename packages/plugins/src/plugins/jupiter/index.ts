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
  asr4Fetcher,
} from './governance';
import { lfgAirdropFetchers } from './launchpad';
import verifiedJob from './verifiedJob';

export const jobs: Job[] = [custodiesJob, verifiedJob, pricingJob];
export const fetchers: Fetcher[] = [
  perpetualFetcher,
  valueAverageFetcher,
  limitFetcher,
  dcaFetcher,
  lockFetcher,
  voteFetcher,
  asr4Fetcher,
];
export const airdropFetchers: AirdropFetcher[] = [
  asr1AirdropFetcher,
  asr2AirdropFetcher,
  asr3AirdropFetcher,
  asr4AirdropFetcher,
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
