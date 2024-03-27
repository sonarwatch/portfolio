import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import depositsFetcher from './realmsDepositsFetcher';
import { heliumPlatform, realmsPlatform } from './constants';
import programsJob from './realmsProgramsJob';

export const jobs: Job[] = [programsJob];
export const fetchers: Fetcher[] = [depositsFetcher];
export const platforms: Platform[] = [realmsPlatform, heliumPlatform];
