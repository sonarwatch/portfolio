import TTLCache from '@isaacs/ttlcache';

const defaultTtl = 600;
const defaultMax = 100;

// T is the type of item memoized
export class MemoryCache<T> {
  private readonly fetch: (key: string) => Promise<T>;
  private cache: TTLCache<string, T>;

  constructor(
    fetch: (owner: string) => Promise<T>,
    ttl: number = defaultTtl,
    max: number = defaultMax
  ) {
    this.fetch = fetch;
    this.cache = new TTLCache({
      max,
      ttl,
    });
  }

  getItem = async (key: string) => {
    let item: T;

    if (!this.cache.has(key)) {
      item = await this.fetch(key);
      this.cache.set(key, item);
      return item;
    }

    return this.cache.get(key) as T;
  };
}
