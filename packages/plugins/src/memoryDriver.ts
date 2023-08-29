import { Driver, TransactionOptions, defineDriver } from 'unstorage';

export const DRIVER_SW_MEMORY_NAME = 'sw-memory';

export interface MemoryStorageOptions {
  ttl?: number;
}

export type MemoryDriver = Driver & {
  exportData(): Map<string, string>;
  importData(data: Map<string, string>, ttl?: number): void;
};

export default defineDriver((opts: MemoryStorageOptions = {}): MemoryDriver => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = new Map<string, string>();
  const timeouts = new Map<string, NodeJS.Timeout>();
  const { ttl } = opts;

  const setItem = (key: string, value: string, cOpts: TransactionOptions) => {
    // Clear previous timeout
    const prevTimeout = timeouts.get(key);
    if (prevTimeout) clearTimeout(prevTimeout);
    timeouts.delete(key);

    const cOpsTtl =
      typeof cOpts?.['ttl'] === 'number' ? cOpts?.['ttl'] : undefined;
    const cTtl = cOpsTtl || ttl || undefined;
    // Set new timout
    if (cTtl) {
      const timeout = setTimeout(() => {
        data.delete(key);
      }, cTtl);
      timeouts.set(key, timeout);
    }

    // Set item
    data.set(key, value);
  };
  return {
    name: DRIVER_SW_MEMORY_NAME,
    options: opts,
    exportData() {
      return data;
    },
    importData(cData: Map<string, string>, cttl?: number) {
      for (const [k, v] of cData) {
        setItem(k, v, { ttl: cttl || undefined });
      }
    },
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      const item = data.get(key);
      if (item === undefined) return null;
      return item;
    },
    getItemRaw(key) {
      const item = data.get(key);
      if (item === undefined) return null;
      return item;
    },
    getItems(items) {
      return items.map((i) => {
        const item = data.get(i.key);
        return {
          key: i.key,
          value: item !== undefined ? item : null,
        };
      });
    },
    setItem,
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return Array.from(data.keys());
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    },
  };
});
