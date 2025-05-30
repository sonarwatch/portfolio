import {
  Cache,
  fetchersByAddressSystem,
  runFetchersByNetworkId,
  runFetcher
} from '@sonarwatch/portfolio-plugins';
import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import { logger } from '../logger/logger';
import portfolioCache from '../cache/cache';
import tokenCache from '../cache/token';
import { Token, TokenRegistry } from '@sonarwatch/token-registry';

class PortfolioService {
  private static instance: PortfolioService;

  private readonly cache: Cache;
  private readonly registry: TokenRegistry;

  private constructor() {
    this.cache = portfolioCache.getCache();
    this.registry = tokenCache.getRegistry();
  }

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  public getPortfolio = async (address: string) => {
    const fetchers = fetchersByAddressSystem['solana'];
    const result = await runFetchersByNetworkId(
      address,
      'solana',
      fetchers,
      this.cache
    );
    const addresses: Array<{ address: string; networkId: NetworkIdType }> = [];
    result.elements.forEach((element) => {
      if (element.type === 'multiple') {
        element.data.assets
          .filter((a) => a.type === 'token' && a.data.address)
          .forEach((a) =>
            addresses.push({
              address: a.data.address!,
              networkId: NetworkId.solana,
            })
          );
      }
    });

    const tokens = await this.registry.getTokens(addresses);
    const tokenInfoMap = tokens.reduce((acc, token: Token | null) => {
      if (token) {
        acc[token.address] = token;
      } else {
        logger.warn(`Token meta not found for address. Address=${address}`);
      }

      return acc;
    }, {} as Record<string, Token>);
    return { ...result, tokenInfo: { solana: tokenInfoMap } };
  };

  public getDefiPortfolio = async (address: string, fetcherId: string) => {
    const fetchers = fetchersByAddressSystem['solana'];
    const fetcher = fetchers.find(f => f.id === fetcherId);

    if (!fetcher) {
      throw new Error(`Fetcher not found. Id=${fetcherId}`);
    }

    return await runFetcher(address, fetcher, this.cache);
  };

}

export default PortfolioService.getInstance();
