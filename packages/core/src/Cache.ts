import { Storage, createStorage, StorageValue, Driver } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import mongodbDriver from 'unstorage/drivers/mongodb';
import redisDriver from 'unstorage/drivers/redis';
import httpDriver from 'unstorage/drivers/http';

import { NetworkIdType } from './Network';
import {
  TokenPrice,
  TokenPriceSource,
  pushTokenPriceSource,
  tokenPriceFromSources,
} from './TokenPrice';

export type TransactionOptions = {
  prefix: string;
  networkId?: NetworkIdType;
};
const ttlPrefix = 'ttl';
const tokenPriceSourcePrefix = 'tokenpricesource';

export class Cache {
  readonly storage: Storage;

  constructor(driver: Driver) {
    this.storage = createStorage({
      driver,
    });
  }

  async hasItem(key: string, opts: TransactionOptions): Promise<boolean> {
    const item = await this.getItem(key, opts);
    return item !== undefined;
  }

  async hasTokenPrice(address: string, networkId: NetworkIdType) {
    const tokenPrice = await this.getTokenPrice(address, networkId);
    return tokenPrice !== undefined;
  }

  async getItem<K extends StorageValue>(
    key: string,
    opts: TransactionOptions
  ): Promise<K | undefined> {
    const fullKey = getFullKey(key, opts);
    let ttl;
    if (opts.prefix !== ttlPrefix) {
      ttl = await this.getItem<number>(fullKey, {
        prefix: ttlPrefix,
      });
    }
    if (ttl && ttl < Date.now()) {
      await this.removeItem(key, opts);
      return undefined;
    }
    return this.storage.getItem(fullKey) as Promise<K | undefined>;
  }

  async getTokenPrice(address: string, networkId: NetworkIdType) {
    const sources = await this.getTokenPriceSources(address, networkId);
    if (!sources) return undefined;
    const tokenPrice = tokenPriceFromSources(sources);
    return tokenPrice;
  }

  private async getTokenPriceSources(
    address: string,
    networkId: NetworkIdType
  ) {
    return this.getItem<TokenPriceSource[]>(address, {
      prefix: tokenPriceSourcePrefix,
      networkId,
    });
  }

  async getItems<K extends StorageValue>(
    opts: TransactionOptions
  ): Promise<K[]> {
    const itemsMap = await this.getItemsAsMap<K>(opts);
    return Array.from(itemsMap.values());
  }

  async getItemsAsMap<K extends StorageValue>(
    opts: TransactionOptions
  ): Promise<Map<string, K>> {
    const keys = await this.getKeys(opts);
    const itemsMap: Map<string, K> = new Map();
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const item = await this.getItem<K>(key, opts);
      if (item !== undefined) itemsMap.set(key, item);
    }
    return itemsMap;
  }

  async getTokenPrices(networkId: NetworkIdType) {
    const addresses = await this.getTokenPriceAddresses(networkId);
    const tokenPrices: Map<string, TokenPrice> = new Map();
    for (let i = 0; i < addresses.length; i += 1) {
      const address = addresses[i];
      const item = await this.getTokenPrice(address, networkId);
      if (item !== undefined) tokenPrices.set(address, item);
    }
    return tokenPrices;
  }

  async setItem<K extends StorageValue>(
    key: string,
    value: K,
    opts: TransactionOptions,
    ttl?: number
  ) {
    const fullKey = getFullKey(key, opts);
    if (ttl) {
      await this.setItem(fullKey, Date.now() + ttl, {
        prefix: ttlPrefix,
      });
    }
    return this.storage.setItem(fullKey, value);
  }

  async setTokenPriceSource(source: TokenPriceSource) {
    let cSources = await this.getItem<TokenPriceSource[]>(source.address, {
      prefix: tokenPriceSourcePrefix,
      networkId: source.networkId,
    });
    if (!cSources) cSources = [];
    const newSources = pushTokenPriceSource(cSources, source);
    if (!newSources) {
      await this.removeItem(source.address, {
        prefix: tokenPriceSourcePrefix,
        networkId: source.networkId,
      });
      return;
    }
    await this.setItem(source.address, newSources, {
      prefix: tokenPriceSourcePrefix,
      networkId: source.networkId,
    });
  }

  async removeItem(key: string, opts: TransactionOptions) {
    const fullKey = getFullKey(key, opts);
    if (opts.prefix !== ttlPrefix) {
      await this.removeItem(fullKey, {
        prefix: ttlPrefix,
      });
    }
    return this.storage.removeItem(fullKey);
  }

  async getKeys(opts: TransactionOptions) {
    const fullBase = getFullBase(opts);
    const keys = (await this.storage.getKeys(fullBase)).map((s) =>
      s.substring(fullBase.length)
    );

    // Verifying that key is still alive
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      await this.hasItem(key, opts);
    }

    return (await this.storage.getKeys(fullBase)).map((s) =>
      s.substring(fullBase.length)
    );
  }

  async getTokenPriceAddresses(networkId: NetworkIdType) {
    return this.getKeys({
      prefix: tokenPriceSourcePrefix,
      networkId,
    });
  }

  dispose() {
    return this.storage.dispose();
  }
}

function getFullKey(key: string, opts: TransactionOptions): string {
  const { networkId, prefix } = opts;
  const networkIdKeyPrefix = networkId ? `/${networkId.toString()}` : '';
  return `/${prefix}${networkIdKeyPrefix}/${key}`;
}

function getFullBase(opts: TransactionOptions) {
  const { networkId, prefix } = opts;
  const networkIdBasePrefix = networkId ? `${networkId.toString()}:` : '';
  const fullBase = `${prefix}:${networkIdBasePrefix}`;
  return fullBase;
}

export function getCacheDriver(): Driver {
  switch (process.env['CACHE_DRIVER_TYPE']) {
    case 'filesystem':
      return fsDriver({
        base: process.env['CACHE_DRIVER_FILESYSTEM_BASE'] || './cache',
      });
    case 'mongodb':
      return mongodbDriver({
        connectionString:
          process.env['CACHE_DRIVER_MONGODB_CONNECTION'] ||
          'mongodb://localhost:27017/',
        databaseName:
          process.env['CACHE_DRIVER_MONGODB_DATABASE'] || 'portfolio',
        collectionName: 'cache',
      });
    case 'redis':
      return redisDriver({
        url: process.env['CACHE_DRIVER_REDIS_URL'] || '127.0.0.1:6379',
        tls: process.env['CACHE_DRIVER_REDIS_TLS'] === 'true' ? {} : undefined,
      });
    default:
      return fsDriver({ base: './cache' });
  }
}

export function getCache() {
  const base = process.env['CACHE_SERVER_ENDPOINT'] || 'http://localhost:3000/';
  const bearerToken = process.env['CACHE_SERVER_BEARER_TOKEN'];
  const headers = bearerToken
    ? {
        Authorization: `Bearer ${bearerToken}`,
      }
    : undefined;

  const driver = httpDriver({
    base,
    headers,
  });
  return new Cache(driver);
}
