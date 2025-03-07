import { Platform } from '@sonarwatch/portfolio-core';
import lpJob from './lpTokensJob';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import whirlpoolJob from './whirlpoolsJob';
import { orcaStakingPlatform, platform, pluginServices } from './constants';
import whirlpoolsStatsJob from './whirlpoolsStatsJob';

export const platforms: Platform[] = [platform, orcaStakingPlatform];
export const jobs: Job[] = [whirlpoolJob, lpJob, whirlpoolsStatsJob];
export const fetchers: Fetcher[] = [];

export const services = pluginServices;
