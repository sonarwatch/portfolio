import { Platform } from '@sonarwatch/portfolio-core';
import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';
import { orcaStakingPlatform, platform } from './constants';

export const platforms: Platform[] = [platform, orcaStakingPlatform];
export const jobs: Job[] = [whirlpoolJob, lpJob];
export const fetchers: Fetcher[] = [];
