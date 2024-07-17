import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { airdropStatics, platform } from './constants';
import lstsJob from './lstsJob';
import airdropFetcher from './airdropFetcher';
import { airdropFetcherToFetcher } from '../../AirdropFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lstsJob];
export const fetchers: Fetcher[] = [
  airdropFetcherToFetcher(
    airdropFetcher,
    platform.id,
    `${platform.id}-airdrop`,
    airdropStatics.claimEnd
  ),
];
export { airdropFetcher };
