import { Fetcher } from './Fetcher';
import { Job } from './Job';
import * as platformsObj from './platforms';
import {
  jobs as tokensJobs,
  fetchers as tokensFetchers,
} from './plugins/tokens';
import {
  fetchers as nativeStakeFetchers,
  jobs as nativeStakeJobs,
} from './plugins/native-stake';
import { fetchers as marinadeFetchers } from './plugins/marinade';
import {
  jobs as marginfiJobs,
  fetchers as marginfiFetchers,
} from './plugins/marginfi';
import {
  jobs as solendJobs,
  fetchers as solendFetchers,
} from './plugins/solend';
import {
  jobs as raydiumJobs,
  fetchers as raydiumFetchers,
} from './plugins/raydium';
import { jobs as orcaJobs, fetchers as orcaFetchers } from './plugins/orca';
import { jobs as meteoraJobs } from './plugins/meteora';
import { jobs as cetusJobs, fetchers as cetusFetchers } from './plugins/cetus';
import {
  jobs as turbosJobs,
  fetchers as turbosFetchers,
} from './plugins/turbos';
import { jobs as thalaJobs, fetchers as thalaFetchers } from './plugins/thala';
import { fetchers as tensorFetchers } from './plugins/tensor';
import { jobs as fooJobs, fetchers as fooFetchers } from './plugins/foo';
import { jobs as driftJobs, fetchers as driftFetchers } from './plugins/drift';
import { jobs as mangoJobs, fetchers as mangoFetchers } from './plugins/mango';
import { getFetchersByAddressSystem } from './utils/misc/getFetchersByAddressSystem';

export * from './Cache';
export * from './Fetcher';
export * from './Job';

export * from './platforms';
export const platforms = Object.values(platformsObj);

export const jobs: Job[] = [
  ...tokensJobs,
  ...nativeStakeJobs,
  ...thalaJobs,
  ...fooJobs,
  ...marginfiJobs,
  ...raydiumJobs,
  ...solendJobs,
  ...meteoraJobs,
  ...orcaJobs,
  ...driftJobs,
  ...mangoJobs,
  ...cetusJobs,
  ...turbosJobs,
];

export const fetchers: Fetcher[] = [
  ...tokensFetchers,
  ...nativeStakeFetchers,
  ...fooFetchers,
  ...tensorFetchers,
  ...marginfiFetchers,
  ...marinadeFetchers,
  ...solendFetchers,
  ...thalaFetchers,
  ...raydiumFetchers,
  ...orcaFetchers,
  ...driftFetchers,
  ...mangoFetchers,
  ...cetusFetchers,
  ...turbosFetchers,
];

export const fetchersByAddressSystem = getFetchersByAddressSystem(fetchers);
