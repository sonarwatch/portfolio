import { StorageValue } from 'unstorage';
import { Cache, TransactionOptions } from '../../Cache';

const defaultMemoizedCacheRefreshInterval = 3600000;

// T is the type of stored item in cache
// K is the type of the item after transformation
export class MemoizedCache<T extends StorageValue, K = T> {
  private readonly key: string;
  private readonly opts: TransactionOptions;
  private readonly transform: ((i: T | undefined) => K) | undefined;
  private readonly ttl: number;
  private readonly fetch: (() => Promise<T>) | undefined;

  private item: K | undefined;
  private lastUpdate: number;

  constructor(
    key: string,
    opts: TransactionOptions,
    transform?: (i: T | undefined) => K,
    ttl: number = defaultMemoizedCacheRefreshInterval,
    fetch?: () => Promise<T>
  ) {
    this.key = key;
    this.opts = opts;
    this.transform = transform;
    this.ttl = ttl;
    this.lastUpdate = 0;
    this.fetch = fetch;
  }

  getItem = async (cache: Cache) => {
    const now = Date.now();

    if (!this.item || this.lastUpdate + this.ttl < now) {
      let rawItem = await cache.getItem<T>(this.key, this.opts);

      if (!rawItem && this.fetch) {
        rawItem = await this.fetch();
        await cache.setItem(this.key, rawItem, this.opts);
      }

      this.item = this.transform ? this.transform(rawItem) : (rawItem as K);
      this.lastUpdate = now;
    }

    return this.item;
  };
}
