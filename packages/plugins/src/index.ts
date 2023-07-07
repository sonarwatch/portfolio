import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import * as platformsObj from './platforms';
import {
  jobs as walletTokensJobs,
  fetchers as walletTokensFetchers,
} from './plugins/wallet-tokens';
import { fetchers as marinadeFetchers } from './plugins/marinade';
import {
  jobs as marginfiJobs,
  fetchers as marginfiFetchers,
} from './plugins/marginfi';
import { jobs as thalaJobs, fetchers as thalaFetchers } from './plugins/thala';
import { fetchers as tensorFetchers } from './plugins/tensor';
import { jobs as fooJobs, fetchers as fooFetchers } from './plugins/foo';

export * from './platforms';
export const platforms = Object.values(platformsObj);

export const jobs: Job[] = [
  ...fooJobs,
  ...marginfiJobs,
  ...walletTokensJobs,
  ...thalaJobs,
];

export const fetchers: Fetcher[] = [
  ...fooFetchers,
  ...tensorFetchers,
  ...marginfiFetchers,
  ...marinadeFetchers,
  ...thalaFetchers,
  ...walletTokensFetchers,
];
