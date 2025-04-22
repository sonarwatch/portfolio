import {
  fetchersByAddressSystem,
  getCache,
  runFetchersByNetworkId,
} from '@sonarwatch/portfolio-plugins';
import { logger } from 'logger/logger';

const cache = getCache();

const getPortfolio = async (address: string) => {
  const fetchers = fetchersByAddressSystem['solana'];
  const result = await runFetchersByNetworkId(
    address,
    'solana',
    fetchers,
    cache,
  );
  logger.info('Data is laded', result);
  return result;
};

export { getPortfolio };
