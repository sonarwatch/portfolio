import { defineDriver } from 'unstorage';

const DRIVER_NAME = 'memory';

export interface MemoryStorageOptions {
  ttl?: number;
}

export default defineDriver((opts: MemoryStorageOptions = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = new Map<string, any>();
  const { ttl } = opts;
  return {
    name: DRIVER_NAME,
    options: opts,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) || null;
    },
    getItemRaw(key) {
      return data.get(key) || null;
    },
    setItem(key, value) {
      data.set(key, value);
      if (ttl) {
        setTimeout(() => {
          data.delete(key);
        }, ttl);
      }
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
