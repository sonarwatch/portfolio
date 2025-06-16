import {
  Cache,
  Fetcher,
  fetchersByAddressSystem,
  runFetchers,
} from '@sonarwatch/portfolio-plugins';
import {
  FetchersResult,
  NetworkId,
  NetworkIdType,
} from '@sonarwatch/portfolio-core';
import { logger } from '../logger/logger';
import portfolioCache from '../cache/cache';
import tokenCache from '../cache/token';
import { Token, TokenRegistry } from '@sonarwatch/token-registry';
import compressionService from './compression';

class PortfolioService {
  private static instance: PortfolioService;
  private static readonly NETWORK = NetworkId.solana;
  private static readonly PREFIX = 'portfolio';

  private readonly cache: Cache;
  private readonly registry: TokenRegistry;
  private readonly portfolioFetchers: Array<Fetcher>;

  private constructor() {
    this.cache = portfolioCache.getCache();
    this.registry = tokenCache.getRegistry();
    this.portfolioFetchers = fetchersByAddressSystem['solana'].filter(
      (f) => f.id != 'wallet-tokens-solana-nfts-underlyings'
    );
  }

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  public getPortfolio = async (address: string) => {
    const cachedPortfolio = await this.cache.getItem<string>(`${address}`, {
      networkId: PortfolioService.NETWORK,
      prefix: PortfolioService.PREFIX,
    });

    if (cachedPortfolio) {
      logger.info(`Portfolio loaded from cache. Address=${address}`);
      return await compressionService.decompress(cachedPortfolio);
    }

    const result = await runFetchers(
      address,
      'solana',
      this.portfolioFetchers,
      this.cache
    );

    const stats = result.fetcherReports.reduce(
      (acc, report) => {
        if (report.status === 'failed') {
          acc.failed.push(report.id);
        }
        if (report.duration && report.duration > acc.longestDuration) {
          acc.longest = report.id;
          acc.longestDuration = report.duration;
        }
        return acc;
      },
      { failed: [], longest: '', longestDuration: 0 } as any
    );
    logger.info(
      `Data fetched. Address=${address} Failed=${stats.failed} ` +
        `Longest=${stats.longest} LongestDuration=${stats.longestDuration}`
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
    const tokenInfoMap = tokens.reduce((acc, token: Token | null, i) => {
      if (token) {
        acc[token.address] = token;
      } else {
        logger.warn(
          `Token meta not found for address. Address=${addresses?.[i]?.address}`
        );
      }

      return acc;
    }, {} as Record<string, Token>);

    const elements = result.elements.filter(
      (e) => e.platformId !== 'wallet-nfts'
    );

    const walletPortfolio: FetchersResult = {
      ...result,
      elements,
      tokenInfo: { solana: tokenInfoMap },
    };

    const compressed = await compressionService.compress(walletPortfolio);
    await this.cache.setItem(`${address}`, compressed, {
      networkId: PortfolioService.NETWORK,
      prefix: PortfolioService.PREFIX,
      ttl: 10000,
    });

    return walletPortfolio;
  };

  public getDefiPortfolio = async (address: string, fetcherId: string) => {
    const fetchers = fetchersByAddressSystem['solana'];
    const fetcher = fetchers.find((f) => f.id === fetcherId);

    if (!fetcher) {
      throw new Error(`Fetcher not found. Id=${fetcherId}`);
    }

    return await runFetchers(address, 'solana', [fetcher], this.cache);
  };
}

export default PortfolioService.getInstance();
