import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import perpetualFetcher from './perpetualFetcher';
import custodiesJob from './custodiesJob';
import airdropFetcher from './airdropFetcher';
import voteFetcher from './voteFetcher';
import { jupiterPlatform } from './constants';
import valueAverageFetcher from './valueAverageFetcher';

export const platforms: Platform[] = [jupiterPlatform];
export const jobs: Job[] = [custodiesJob];
export const fetchers: Fetcher[] = [
  perpetualFetcher,
  airdropFetcher,
  voteFetcher,
  valueAverageFetcher,
];
