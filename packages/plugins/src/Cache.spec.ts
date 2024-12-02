import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache, getCacheConfig } from './Cache';
import sleep from './utils/misc/sleep';

import 'dotenv/config';

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
    await sleep(500);
    const tokenPrice2 = await cache.getTokenPrice(
      sourceA.address,
      NetworkId.solana
    );

    await cache.dispose();
    expect(tokenPrice).toBeDefined();
    expect(tokenPrice2).toBeDefined();

    expect(tokenPrice?.price).toBe(1.5);
    expect(tokenPrice2?.price).toBe(1.5);
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
      networkId: 'solana',
    });
    await cache.setItem(keys[1], values[1], {
      prefix,
      networkId: 'solana',
    });
    await cache.setItem(keys[2], values[2], {
      prefix,
      networkId: 'solana',
    });
    await cache.setItem(keys[3], values[3], {
      prefix,
      networkId: 'solana',
    });
    await cache.setItem('key-5', 'value-5', {
      prefix,
      networkId: 'avalanche',
    });

    const items = await cache.getItems([keys[1], keys[3], keys[0]], {
      prefix,
      networkId: 'solana',
    });
    expect(items).toStrictEqual([values[1], values[3], values[0]]);
  });

  it('should getTokenPrices', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });

    const tokenAAddress = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';
    const sourceATokenA: TokenPriceSource = {
      address: tokenAAddress,
      decimals: 9,
      id: 'sourceA',
      networkId: NetworkId.solana,
      platformId: 'platformId',
      price: 1,
      timestamp: Date.now(),
      weight: 0.5,
    };
    const sourceBTokenA: TokenPriceSource = {
      ...sourceATokenA,
      id: 'sourceB',
      price: 2,
    };

    const tokenBAddress = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
    const sourceATokenB: TokenPriceSource = {
      address: tokenBAddress,
      decimals: 18,
      id: 'sourceA',
      networkId: NetworkId.ethereum,
      platformId: 'platformId',
      price: 1,
      timestamp: Date.now(),
      weight: 0.5,
    };
    const sourceBTokenB: TokenPriceSource = {
      ...sourceATokenB,
      id: 'sourceB',
      price: 2,
    };

    const tokenCAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
    const sourceATokenC: TokenPriceSource = {
      address: tokenCAddress,
      decimals: 18,
      id: 'sourceA',
      networkId: NetworkId.ethereum,
      platformId: 'platformId',
      price: 2,
      timestamp: Date.now(),
      weight: 0.5,
    };
    const sourceBTokenC: TokenPriceSource = {
      ...sourceATokenC,
      id: 'sourceB',
      price: 4,
    };

    await cache.setTokenPriceSource(sourceATokenA);
    await cache.setTokenPriceSource(sourceBTokenA);
    await cache.setTokenPriceSource(sourceATokenB);
    await cache.setTokenPriceSource(sourceBTokenB);
    await cache.setTokenPriceSource(sourceATokenC);
    await cache.setTokenPriceSource(sourceBTokenC);

    const tokenPrices = await cache.getTokenPrices(
      [tokenCAddress, tokenBAddress, tokenCAddress],
      NetworkId.ethereum
    );

    expect(tokenPrices.at(0)?.address).toBe(tokenCAddress);
    expect(tokenPrices.at(1)?.address).toBe(tokenBAddress);
    expect(tokenPrices.at(2)?.address).toBe(tokenCAddress);
    expect(tokenPrices.at(0)?.price).toBe(3);
    expect(tokenPrices.at(1)?.price).toBe(1.5);
  });

  it('should use token price config cache', async () => {
    const config = getCacheConfig();
    const cache = new Cache(config);

    const sourceA: TokenPriceSource = {
      address:
        '777888899994f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::XX::XX',
      decimals: 9,
      id: 'sourceA',
      networkId: NetworkId.sui,
      platformId: 'foo',
      price: 1,
      timestamp: Date.now(),
      weight: 0.5,
    };
    await cache.setTokenPriceSource(sourceA);
    const tokenPrice = await cache.getTokenPrice(
      '0x777888899994f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::XX::XX',
      NetworkId.sui
    );
    expect(tokenPrice).toBeDefined();
    expect(tokenPrice?.price).toBe(1);
    const fasterTokenPrice = await cache.getTokenPrice(
      sourceA.address,
      NetworkId.sui
    );
    expect(fasterTokenPrice).toBeDefined();
    expect(fasterTokenPrice?.price).toBe(1);
  });
});
