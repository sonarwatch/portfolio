import { Platform, Service } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
// import lpTokensJob from './lpTokensJob';
import lpTokensApiJob from './ammV2ApiJob';
import clmmJob from './clmmJob';
import cpmmJob from './cpmmJob';
import farmsJob from './farmsJob';
import { platform, pluginServices } from './constants';
import farmsFetcher from './farmsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [lpTokensApiJob, farmsJob, clmmJob, cpmmJob];
export const fetchers: Fetcher[] = [farmsFetcher];
export const services: Service[] = pluginServices;
