import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import * as platformsObj from './platforms';
import {
  jobs as tokensJobs,
  fetchers as tokensFetchers,
} from './plugins/tokens';
import { fetchers as marinadeFetchers } from './plugins/marinade';
import {
  jobs as marginfiJobs,
  fetchers as marginfiFetchers,
} from './plugins/marginfi';
import { jobs as thalaJobs, fetchers as thalaFetchers } from './plugins/thala';
import { fetchers as tensorFetchers } from './plugins/tensor';
import { jobs as fooJobs, fetchers as fooFetchers } from './plugins/foo';
import { getFetchersByAddressSystem } from './utils/misc/getFetchersByAddressSystem';

export * from './platforms';
export const platforms = Object.values(platformsObj);

export const jobs: Job[] = [
  ...thalaJobs,
  ...fooJobs,
  ...marginfiJobs,
  ...tokensJobs,
];

export const fetchers: Fetcher[] = [
  ...fooFetchers,
  ...tensorFetchers,
  ...marginfiFetchers,
  ...marinadeFetchers,
  ...thalaFetchers,
  ...tokensFetchers,
];

export const fetchersByAddressSystem = getFetchersByAddressSystem(fetchers);
