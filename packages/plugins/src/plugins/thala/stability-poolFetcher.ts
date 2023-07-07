import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { platformId } from './constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // do some stuff
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-stability-pool`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
