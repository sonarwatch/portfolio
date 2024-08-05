import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { airdropStatics, platform } from './constants';
import marketsJob from './marketsJob';
import positionsFetcher from './positionsFetcher';
import airdropFetcher from './airdropFetcher';
import { airdropFetcherToFetcher } from '../../AirdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [marketsJob];
export const fetchers: Fetcher[] = [
  positionsFetcher,
  airdropFetcherToFetcher(
    airdropFetcher,
    platform.id,
    'foo-airdrop',
    airdropStatics.claimEnd
  ),
];
export { airdropFetcher };
