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
});
