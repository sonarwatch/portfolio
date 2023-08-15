import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import jupiterFetcher from './jupiter/limitFetcher';
import serumFetcher from './clobs-solana/serumFetcher';
import openbookFetcher from './clobs-solana/openbookFetcher';
import { markets } from './clobs-solana/constants';
import getMarketJobExecutor from './clobs-solana/MarketJobExecutorGenerator';
import { platformId } from './constants';

export const jobs: Job[] = [
  {
    id: `${platformId}-markets-serumV1`,
    executor: getMarketJobExecutor(markets.serumV1),
  },
  {
    id: `${platformId}-markets-serumV2`,
    executor: getMarketJobExecutor(markets.serumV2),
  },
  {
    id: `${platformId}-markets-serumV3`,
    executor: getMarketJobExecutor(markets.serumV3),
  },
  {
    id: `${platformId}-markets-openbookV1`,
    executor: getMarketJobExecutor(markets.openbookV1),
  },
];
export const fetchers: Fetcher[] = [
  jupiterFetcher,
  serumFetcher,
  openbookFetcher,
];
