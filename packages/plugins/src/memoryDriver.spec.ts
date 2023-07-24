import { createStorage } from 'unstorage';
import memoryDriver from './memoryDriver';
import sleep from './utils/misc/sleep';

describe('MemoryDriver', () => {
  it('should works', async () => {
    const storage = createStorage({
      driver: memoryDriver({
        ttl: 500,
      }),
    });
    const key = 'abc';
    const value = 'def';
    await storage.setItem(key, value);
    const item = await storage.getItem(key);
    expect(item).not.toBeNull();
    await sleep(600);
    const item2 = await storage.getItem(key);
    expect(item2).toBeNull();
  });

  it('should works', async () => {
    const storage = createStorage({
      driver: memoryDriver({}),
    });
    const keys = ['abc', 'ijk'];
    const values = ['def', 'lmn'];
    await storage.setItem(keys[0], values[0]);
    await storage.setItem(keys[1], values[1]);
    const items = await storage.getItems(keys);
    expect(items).toEqual(
      keys.map((k, i) => ({
        key: k,
        value: values[i],
      }))
    );
  });
});
