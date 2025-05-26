import {
  fetchersByAddressSystem,
  runFetchersByNetworkId,
  Cache
} from '@sonarwatch/portfolio-plugins';
import {
  Token,
  TokenList,
} from '@sonarwatch/portfolio-plugins/src/plugins/tokens/types';
import { TokenInfo } from '@sonarwatch/portfolio-core';
import { tokenListsPrefix } from '@sonarwatch/portfolio-plugins/src/plugins/tokens/constants';
import { logger } from '../logger/logger';
import portfolioCache from '../cache/cache';

class PortfolioService {
  private static instance: PortfolioService;

  private readonly cache: Cache;
  private tokensMap?: Record<string, Token>;


  private constructor() {
    this.cache = portfolioCache.getCache()
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
    const addresses: string[] = [];
    result.elements.forEach((element) => {
      if (element.type === 'multiple') {
        element.data.assets
          .filter((a) => a.type === 'token')
          .forEach((a) => a.data.address && addresses.push(a.data.address));
      }
    });

    if (!this.tokensMap) {
      const tokenList = await this.cache.getItem<TokenList>('solana', {
        prefix: tokenListsPrefix,
      });
      this.tokensMap = tokenList?.tokens.reduce((acc, token) => {
        acc[token.address] = token;
        return acc;
      }, {} as Record<string, Token>);
    }
    const tokenInfoMap = addresses.reduce((acc, address: string) => {
      const token = this.tokensMap && this.tokensMap[address];

      if (token) {
        acc[address] = {
          ...token,
          networkId: 'solana',
          extensions: undefined,
        };
      } else {
        logger.warn(`Token meta not found for address. Address=${address}`);
      }

      return acc;
    }, {} as Record<string, TokenInfo | undefined>);
    return { ...result, tokenInfo: { solana: tokenInfoMap } };
  };
}

export default PortfolioService.getInstance();
