import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import pTokensJob from './pTokensJob';
import reserveJob from './reservesJob';
import obligationsFetcher from './obligationsFetcher';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [pTokensJob, reserveJob];
export const fetchers: Fetcher[] = [obligationsFetcher];
