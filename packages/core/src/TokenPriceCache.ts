import { Driver } from 'unstorage';
import mongodbDriver from 'unstorage/drivers/mongodb';
import { NetworkIdType } from './Network';
import { Cache } from './Cache';
import {
  TokenPrice,
  TokenPriceSource,
  pushTokenPriceSource,
  tokenPriceFromSources,
} from './TokenPrice';

const TOKEN_PRICE_TIMEOUT = 60 * 1000;
const TOKEN_PRICE_PREFIX = 'tokenprice';

export class TokenPriceCache {
  private readonly cache: Cache;

  constructor(driver: Driver) {
    this.cache = new Cache(driver);
  }

  has(address: string, networkId: NetworkIdType) {
    return this.cache.has(address, { prefix: TOKEN_PRICE_PREFIX, networkId });
  }

  async get(address: string, networkId: NetworkIdType) {
    const tokenPrice = await this.cache.get<TokenPrice>(address, {
      prefix: TOKEN_PRICE_PREFIX,
      networkId,
    });

    // Refresh tokenPrice is old
    if (tokenPrice && Date.now() - TOKEN_PRICE_TIMEOUT > tokenPrice.timestamp)
      this.refresh(address, networkId);

    return tokenPrice;
  }

  async refresh(address: string, networkId: NetworkIdType) {
    const cachedTokenPrice = await this.cache.get<TokenPrice>(address, {
      prefix: TOKEN_PRICE_PREFIX,
      networkId,
    });
    if (!cachedTokenPrice) return;
    const newTokenPrice = tokenPriceFromSources(cachedTokenPrice.sources);
    if (!newTokenPrice) {
      await this.cache.remove(address, {
        prefix: TOKEN_PRICE_PREFIX,
        networkId,
      });
      return;
    }
    await this.cache.set(newTokenPrice.address, newTokenPrice, {
      prefix: TOKEN_PRICE_PREFIX,
      networkId: newTokenPrice.networkId,
    });
  }

  async refreshAll(networkId: NetworkIdType) {
    const addresses = await this.cache.keys({
      prefix: TOKEN_PRICE_PREFIX,
      networkId,
    });
    for (let i = 0; i < addresses.length; i += 1) {
      const address = addresses[i];
      await this.refresh(address, networkId);
    }
  }

  async set(source: TokenPriceSource) {
    const cachedTokenPrice = await this.cache.get<TokenPrice>(source.address, {
      prefix: TOKEN_PRICE_PREFIX,
      networkId: source.networkId,
    });
    const cachedSources = cachedTokenPrice?.sources || [];

    const newSources = pushTokenPriceSource(cachedSources, source);
    if (!newSources) {
      await this.cache.remove(source.address, {
        prefix: TOKEN_PRICE_PREFIX,
        networkId: source.networkId,
      });
      return;
    }
    const newTokenPrice = tokenPriceFromSources(newSources);
    if (!newTokenPrice) {
      await this.cache.remove(source.address, {
        prefix: TOKEN_PRICE_PREFIX,
        networkId: source.networkId,
      });
      return;
    }
    await this.cache.set(newTokenPrice.address, newTokenPrice, {
      prefix: TOKEN_PRICE_PREFIX,
      networkId: newTokenPrice.networkId,
    });
  }
}

export function getTokenPriceCache() {
  const connectionString =
    process.env['CACHE_MONGODB_CONNECTION_STRING'] ||
    'mongodb://localhost:27017';
  const databaseName = process.env['CACHE_MONGODB_DB_NAME'] || 'portfolio';
  const collectionName =
    process.env['CACHE_MONGODB_COLLECTION_NAME'] || 'cache-token-price';
  const driver = mongodbDriver({
    connectionString,
    databaseName,
    collectionName,
  });
  return new TokenPriceCache(driver);
}
