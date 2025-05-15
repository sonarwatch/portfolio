import {
  fetchersByAddressSystem,
  getCache,
  runFetchersByNetworkId,
} from '@sonarwatch/portfolio-plugins';
import { logger } from '../logger/logger';

const cache = getCache();

const getPortfolio = async (address: string) => {
  const fetchers = fetchersByAddressSystem['solana'];
  const result = await runFetchersByNetworkId(
    address,
    'solana',
    fetchers,
    cache,
  );
  const addresses: string[] = []
  result.elements.forEach(element => {
    if (element.type === 'multiple') {
      element.data.assets
        .forEach(a => a.data.address && addresses.push(a.data.address));
    }
  })
  logger.info(addresses, 'Tokens collected.');
  const tokenInfo = await cache.getTokenPrices(addresses, 'solana');
  logger.info(tokenInfo, 'Tokens are laded');
  return { ...result, tokenInfo };
};

export { getPortfolio };
