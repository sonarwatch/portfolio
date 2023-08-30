import { Platform } from '@sonarwatch/portfolio-core';
import { Job } from '../../Job';
import { Fetcher } from '../../Fetcher';
import suiFetcher from './suiFetcher';
import aptosFetcher from './aptosFetcher';
import solanaFetcher from './solanaFetcher';
import aptosValidatorsJob from './activeValidatorsJob';
import { nativeStakePlatform } from './constants';

export const platforms: Platform[] = [nativeStakePlatform];
export const jobs: Job[] = [aptosValidatorsJob];
export const fetchers: Fetcher[] = [suiFetcher, aptosFetcher, solanaFetcher];
