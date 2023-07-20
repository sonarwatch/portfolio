import { Cache } from './Cache';
import sleep from './helpers/sleep';
import { TokenPriceSource } from './TokenPrice';
import { NetworkId } from './Network';

describe('Cache', () => {
  it('should works', async () => {
    const key = 'key';
    const value = 'value';
    const prefix = 'prefix';
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    await cache.setItem(key, value, {
      prefix,
    });
    const item = await cache.getItem(key, {
      prefix,
    });
    expect(item).toBe(value);
  });

  it('should use token price cache', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    const sourceA: TokenPriceSource = {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      decimals: 9,
      id: 'sourceA',
      networkId: NetworkId.solana,
      platformId: 'foo',
      price: 1,
      timestamp: Date.now(),
      weight: 0.5,
    };
    await cache.setTokenPriceSource(sourceA);
    const tokenPrice = await cache.getTokenPrice(
      sourceA.address,
      NetworkId.solana
    );
    expect(tokenPrice).toBeDefined();
    expect(tokenPrice?.price).toBe(1);
    const fasterTokenPrice = await cache.getTokenPrice(
      sourceA.address,
      NetworkId.solana
    );
    expect(fasterTokenPrice).toBeDefined();
    expect(fasterTokenPrice?.price).toBe(1);
  });

  it('should set token price sources', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    const sourceA: TokenPriceSource = {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      decimals: 9,
      id: 'sourceA',
      platformId: 'foo',
      networkId: NetworkId.solana,
      price: 1,
      timestamp: Date.now(),
      weight: 0.5,
    };
    const sourceB: TokenPriceSource = {
      ...sourceA,
      id: 'sourceB',
      price: 2,
      timestamp: Date.now(),
      weight: 0.5,
    };
    await cache.setTokenPriceSource(sourceA);
    await cache.setTokenPriceSource(sourceB);
    await sleep(500);
    const tokenPrice = await cache.getTokenPrice(
      sourceA.address,
      NetworkId.solana
    );
    expect(tokenPrice).toBeDefined();
    expect(tokenPrice?.price).toBe(1.5);
  });

  it('should works with ttl', async () => {
    const key = 'key';
    const value = 'value';
    const prefix = 'prefix';
    const cache = new Cache({
      type: 'memory',
      params: {
        ttl: 500,
      },
    });
    await cache.setItem(key, value, {
      prefix,
    });
    const item = await cache.getItem(key, {
      prefix,
    });
    expect(item).toBe(value);
    await sleep(600);
    const item2 = await cache.getItem(key, {
      prefix,
    });
    expect(item2).toBeUndefined();
  });

  it('should get items', async () => {
    const keys = ['key-1', 'key-2', 'key-3', 'key-4'];
    const values = ['value-1', 'value-2', 'value-3', 'value-4'];
    const prefix = 'prefix';
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    await cache.setItem(keys[0], values[0], {
      prefix,
    });
    await cache.setItem(keys[1], values[1], {
      prefix,
    });
    await cache.setItem(keys[2], values[2], {
      prefix,
    });
    await cache.setItem(keys[3], values[3], {
      prefix,
    });

    const items = await cache.getItems([keys[1], keys[3], keys[0]], {
      prefix,
    });

    expect(items).toStrictEqual([values[1], values[3], values[0]]);
  });
});
