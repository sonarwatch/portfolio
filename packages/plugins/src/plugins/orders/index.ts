import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import { openbookPlatform, serumPlatform } from './clobs-solana/constants';
// import { NetworkId } from '@sonarwatch/portfolio-core';
// import openbookFetcher from './clobs-solana/openbookFetcher';
// import { clobVersions } from './clobs-solana/constants';
// import getMarketJobExecutor from './clobs-solana/MarketJobExecutorGenerator';
// import { platformId } from './constants';
// import getSerumFetcherExecutor from './clobs-solana/serumFetcherExecutorGenerator';
// import { serumPlatform } from '../../platforms';

export const platforms: Platform[] = [openbookPlatform, serumPlatform];
export const jobs: Job[] = [
  // {
  //   id: `${platformId}-markets-openbookV1`,
  //   executor: getMarketJobExecutor(clobVersions.openbookV1),
  // },
  // {
  //   id: `${platformId}-markets-serumV3`,
  //   executor: getMarketJobExecutor(clobVersions.serumV3),
  // },
  // {
  //   id: `${platformId}-markets-serumV2`,
  //   executor: getMarketJobExecutor(clobVersions.serumV2),
  // },
  // {
  //   id: `${platformId}-markets-serumV1`,
  //   executor: getMarketJobExecutor(clobVersions.serumV1),
  // },
];
export const fetchers: Fetcher[] = [
  // openbookFetcher,
  // {
  //   id: `${platformId}-${serumPlatform.id}V3`,
  //   executor: getSerumFetcherExecutor(clobVersions.serumV3),
  //   networkId: NetworkId.solana,
  // },
  // {
  //   id: `${platformId}-${serumPlatform.id}V2`,
  //   executor: getSerumFetcherExecutor(clobVersions.serumV2),
  //   networkId: NetworkId.solana,
  // },
  // {
  //   id: `${platformId}-${serumPlatform.id}V1`,
  //   executor: getSerumFetcherExecutor(clobVersions.serumV1),
  //   networkId: NetworkId.solana,
  // },
];
