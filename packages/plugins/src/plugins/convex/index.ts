import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { platform } from './constants';
import getStackedCvxFxsFetcher from './getStackedCvxFxsFetcher';
import getFXBYieldFetcher from './getFXBYieldFetcher';
import getWFXBPriceJob from './getWFXBPriceJob';

export const platforms: Platform[] = [platform];
export const jobs: Job[] = [getWFXBPriceJob];
export const fetchers: Fetcher[] = [
  getStackedCvxFxsFetcher(NetworkId.fraxtal),
  getFXBYieldFetcher(NetworkId.fraxtal),
];
