import { Storage, createStorage, StorageValue, Driver } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';

import { NetworkIdType } from './Network';

export type TransactionOptions = {
  prefix: string;
  networkId?: NetworkIdType;
};

export class Cache {
  private readonly storage: Storage;

  constructor(driver: Driver) {
    this.storage = createStorage({
      driver,
    });
  }

  has(key: string, opts: TransactionOptions) {
    const fullKey = getFullKey(key, opts);
    return this.storage.hasItem(fullKey);
  }

  get<K extends StorageValue>(
    key: string,
    opts: TransactionOptions
  ): Promise<K | undefined> {
    const fullKey = getFullKey(key, opts);
    return this.storage.getItem(fullKey) as Promise<K | undefined>;
  }

  set<K extends StorageValue>(key: string, value: K, opts: TransactionOptions) {
    const fullKey = getFullKey(key, opts);
    return this.storage.setItem(fullKey, value);
  }

  remove(key: string, opts: TransactionOptions) {
    const fullKey = getFullKey(key, opts);
    return this.storage.removeItem(fullKey);
  }

  async keys(opts: TransactionOptions) {
    const fullBase = getFullBase(opts);
    return (await this.storage.getKeys(fullBase)).map((s) =>
      s.substring(fullBase.length)
    );
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

export function getCache() {
  const driver = fsDriver({ base: './cache' });
  return new Cache(driver);
}
