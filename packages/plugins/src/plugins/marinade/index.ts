import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import ticketsFetcher from './ticketsFetcher';
import { marinadePlatform } from './constants';

export const platforms: Platform[] = [marinadePlatform];
export const fetchers: Fetcher[] = [ticketsFetcher];
