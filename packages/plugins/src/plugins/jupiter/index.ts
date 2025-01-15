import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import perpetualFetcher from './exchange/perpetualFetcher';
import valueAverageFetcher from './exchange/valueAverageFetcher';
import limitFetcher from './exchange/limitFetcher';
import dcaFetcher from './exchange/dcaFetcher';
import lockFetcher from './exchange/lockFetcher';
import custodiesJob from './exchange/custodiesJob';

import { platform as launchpadPlatform } from './launchpad/constants';
import voteFetcher from './governance/voteFetcher';
import { platform as governancePlatform } from './governance/constants';
import pricingJob from './pricingJob';
import { platform as exchangePlatform } from './exchange/constants';
import { AirdropFetcher } from '../../AirdropFetcher';
import {
  asr1AirdropFetcher,
  asr1Fetcher,
  asr2AirdropFetcher,
  asr2Fetcher,
} from './governance';
import { airdropFetcher as jupuaryAirdropFetcher } from './governance/JupuaryAirdropFetcher';
import { lfgAirdropFetchers, lfgFetchers } from './launchpad';

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
  lockFetcher,
  voteFetcher,
  asr1Fetcher,
  asr2Fetcher,
  ...lfgFetchers,
];
export const airdropFetchers: AirdropFetcher[] = [
  asr1AirdropFetcher,
  asr2AirdropFetcher,
  ...lfgAirdropFetchers,
  // jupuaryAirdropFetcher,
];
