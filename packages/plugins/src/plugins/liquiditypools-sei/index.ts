import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import job from './job';
import fetcher from './fetcher';
import { astroportPlatform, fuzioPlatform, seaswapPlatform } from './constants';

export const platforms: Platform[] = [
  fuzioPlatform,
  seaswapPlatform,
  astroportPlatform,
];
export const jobs: Job[] = [job];
export const fetchers: Fetcher[] = [fetcher];
