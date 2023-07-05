import { Fetcher, Job } from '@sonarwatch/portfolio-core';
import { jobs as wallettokensJobs } from './plugins/wallettokens';
import { fetchers as marinadeFetchers } from './plugins/marinade';
import {
  jobs as marginfiJobs,
  fetchers as marginfiFetchers,
} from './plugins/marginfi';
import { fetchers as tensorFetchers } from './plugins/tensor';
import { jobs as fooJobs, fetchers as fooFetchers } from './plugins/foo';

export const jobs: Job[] = [...fooJobs, ...marginfiJobs, ...wallettokensJobs];

export const fetchers: Fetcher[] = [
  ...fooFetchers,
  ...tensorFetchers,
  ...marginfiFetchers,
  ...marinadeFetchers,
];
