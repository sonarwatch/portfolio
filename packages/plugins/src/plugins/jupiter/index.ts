import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import perpetualFetcher from './exchange/perpetualFetcher';
import valueAverageFetcher from './exchange/valueAverageFetcher';
import limitFetcher from './exchange/limitFetcher';
import dcaFetcher from './exchange/dcaFetcher';
import custodiesJob from './exchange/custodiesJob';

import allocationFetcher from './launchpad/allocationsFetcher';
import { platform as launchpadPlatform } from './launchpad/constants';

import voteFetcher from './governance/voteFetcher';
import asrFetcher from './governance/asrFetcher';
import { platform as governancePlatform } from './governance/constants';

import pricingJob from './pricingJob';
import { platform as exchangePlatform } from './exchange/constants';

export const platforms: Platform[] = [
  launchpadPlatform,
  governancePlatform,
  exchangePlatform,
];
export const jobs: Job[] = [custodiesJob, pricingJob];
export const fetchers: Fetcher[] = [
  perpetualFetcher,
  valueAverageFetcher,
  limitFetcher,
  dcaFetcher,
  allocationFetcher,
  asrFetcher,
  voteFetcher,
];
