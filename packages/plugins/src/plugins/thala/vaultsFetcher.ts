import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import { getClientAptos } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientAptos();

  // do some stuff
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
