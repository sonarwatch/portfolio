import { createStorage } from 'unstorage';
import memoryDriver, { MemoryDriver } from './memoryDriver';
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

  it('should export data', async () => {
    const driver = memoryDriver({}) as MemoryDriver;
    const keys = ['abc', 'ijk'];
    const values = ['def', 'lmn'];
    if (!driver.setItem) throw new Error('driver.setItem is missing');
    await driver.setItem(keys[0], values[0], {});
    await driver.setItem(keys[1], values[1], {});
    const data = driver.exportData();
    expect(data).toEqual(
      new Map([
        [keys[0], values[0]],
        [keys[1], values[1]],
      ])
    );
  });

  it('should import data', async () => {
    const driver = memoryDriver({}) as MemoryDriver;
    const data = new Map([
      ['abc', 'def'],
      ['ijk', 'lmn'],
    ]);
    driver.importData(data);
    const keys = ['abc', 'ijk'];
    const values = ['def', 'lmn'];
    if (!driver.getItems) throw new Error('driver.getItems is missing');
    const items = await driver.getItems(keys.map((key) => ({ key })));
    expect(items).toEqual(
      keys.map((k, i) => ({
        key: k,
        value: values[i],
      }))
    );
  });
});
