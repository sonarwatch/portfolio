import { defineDriver } from 'unstorage';

const DRIVER_NAME = 'memory';

export interface MemoryStorageOptions {
  ttl?: number;
}

export default defineDriver((opts: MemoryStorageOptions = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = new Map<string, any>();
  const timeouts = new Map<string, NodeJS.Timeout>();
  const { ttl } = opts;
  return {
    name: DRIVER_NAME,
    options: opts,
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
    setItem(key, value) {
      // Clear previous timeout
      const prevTimeout = timeouts.get(key);
      if (prevTimeout) clearTimeout(prevTimeout);
      timeouts.delete(key);

      // Set new timout
      if (ttl) {
        const timeout = setTimeout(() => {
          data.delete(key);
        }, ttl);
        timeouts.set(key, timeout);
      }

      // Set item
      data.set(key, value);
    },
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
