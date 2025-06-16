import {
  Cache,
  Fetcher,
  fetchersByAddressSystem,
  runFetchers,
} from '@sonarwatch/portfolio-plugins';
import { FetchersResult, NetworkId } from '@sonarwatch/portfolio-core';
import { logger } from '../logger/logger';
import portfolioCache from '../cache/cache';
import compressionService from './compression';

class NftService {
  private static instance: NftService;
  private static readonly NETWORK = NetworkId.solana;
  private static readonly PREFIX = 'nfts';

  private readonly cache: Cache;
  private readonly nftFetchers: Array<Fetcher>;

  private constructor() {
    this.cache = portfolioCache.getCache();

    this.nftFetchers = fetchersByAddressSystem['solana'].filter((f) =>
      [
        'wallet-tokens-solana',
        'wallet-tokens-solana-nfts-underlyings',
      ].includes(f.id)
    );
  }

  public static getInstance(): NftService {
    if (!NftService.instance) {
      NftService.instance = new NftService();
    }
    return NftService.instance;
  }

  public getNfts = async (address: string) => {
    const cachedNfts = await this.cache.getItem<string>(`${address}`, {
      networkId: NftService.NETWORK,
      prefix: NftService.PREFIX,
    });

    if (cachedNfts) {
      logger.info(`NFTs loaded from cache. Address=${address}`);
      return await compressionService.decompress(cachedNfts);
    }

    const result = await runFetchers(
      address,
      'solana',
      this.nftFetchers,
      this.cache
    );

    const nfts = result.elements
      .filter(e => e.platformId === 'wallet-nfts')

    const walletPortfolio: FetchersResult = {
      ...result,
      elements: nfts,
      tokenInfo: { solana: {} },
    };

    const compressed = await compressionService.compress(walletPortfolio);
    await this.cache.setItem(`${address}`, compressed, {
      networkId: NftService.NETWORK,
      prefix: NftService.PREFIX,
      ttl: 10000,
    });

    return walletPortfolio;
  };
}

export default NftService.getInstance();
