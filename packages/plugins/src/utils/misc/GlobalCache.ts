import { StorageValue } from 'unstorage';
import { Cache, TransactionOptions } from '../../Cache';

const defaultGlobalCacheRefreshInterval = 3600000;

export class GlobalCache<K extends StorageValue> {
  private readonly ttl: number;
  private item: K | undefined;
  private lastUpdate: number;

  constructor(ttl: number = defaultGlobalCacheRefreshInterval) {
    this.ttl = ttl;
    this.lastUpdate = 0;
  }

  getItem = async (cache: Cache, key: string, opts: TransactionOptions) => {
    const now = Date.now();

    if (!this.item || this.lastUpdate + this.ttl < now) {
      this.item = await cache.getItem<K>(key, opts);
      this.lastUpdate = now;
    }

    return this.item;
  };
}
