import BigNumber from 'bignumber.js';
import { NetworkId, networks } from '@sonarwatch/portfolio-core';
import computeAndStoreLpPrice, { PoolData } from './computeAndStoreLpPrice';
import { Cache } from '../../Cache';

describe('ComputeAndStoreLpPrice', () => {
  it('should return an LP', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    await cache.setTokenPriceSource({
      address: networks.solana.native.address,
      decimals: networks.solana.native.decimals,
      id: 'SOL',
      networkId: NetworkId.solana,
      platformId: 'platformId',
      price: 15,
      timestamp: Date.now(),
      weight: 1,
    });

    const poolData: PoolData = {
      id: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeEVY',
      lpDecimals: 6,
      supply: new BigNumber('1500000000'),
      mintTokenX: networks.solana.native.address,
      mintTokenY: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      decimalY: 6,
      reserveTokenX: new BigNumber('1200000000000'),
      reserveTokenY: new BigNumber('2000000000'),
    };

    // Supply LP : 1500000000 / (10 ** 6) = 1500
    // Supply SOL : 1200000000000 / (10 ** 9)  * 15 = $18,000
    // Supply UXP : 2000000000 / (10 ** 6)

    // Price UXP : $18,000 / 2,000 = $9

    // Price LP : $18,000 * 2 / 1500 = 24

    await computeAndStoreLpPrice(
      cache,
      poolData,
      NetworkId.solana,
      'platformId'
    );

    const price = await cache.getTokenPrice(
      'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeEVY',
      NetworkId.solana
    );

    expect(price).not.toBeUndefined();
    expect(price?.price).toBe(24);
    expect(price?.underlyings?.length).toBe(2);
  });

  it('should not return an LP', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    await cache.setTokenPriceSource({
      address: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      decimals: 6,
      id: 'UXP',
      networkId: NetworkId.solana,
      platformId: 'platformId',
      price: 0.1,
      timestamp: Date.now(),
      weight: 1,
    });

    const poolData: PoolData = {
      id: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeNoT',
      lpDecimals: 6,
      supply: new BigNumber('1500000000'),
      mintTokenX: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeTES',
      decimalX: 9,
      mintTokenY: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      reserveTokenX: new BigNumber('1200000000000'),
      reserveTokenY: new BigNumber('2000000000'),
    };

    await computeAndStoreLpPrice(
      cache,
      poolData,
      NetworkId.solana,
      'platformId'
    );

    const price = await cache.getTokenPrice(
      'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeNoT',
      NetworkId.solana
    );

    expect(price).toBeUndefined();
  });

  it('should return an LP', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    await cache.setTokenPriceSource({
      address: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      decimals: 6,
      id: 'UXP',
      networkId: NetworkId.solana,
      platformId: 'platformId',
      price: 1,
      timestamp: Date.now(),
      weight: 1,
    });
    await cache.setTokenPriceSource({
      address: networks.solana.native.address,
      decimals: networks.solana.native.decimals,
      id: 'SOL',
      networkId: NetworkId.solana,
      platformId: 'platformId',
      price: 1.8,
      timestamp: Date.now(),
      weight: 1,
    });

    const poolData: PoolData = {
      id: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeNoT',
      lpDecimals: 6,
      supply: new BigNumber('1500000000'),
      mintTokenX: networks.solana.native.address,
      mintTokenY: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      reserveTokenX: new BigNumber('12000000000000'),
      reserveTokenY: new BigNumber('20000000000'),
    };

    // Supply LP : 1500000000 / (10 ** 6) = 1500
    // Supply SOL : 1200000000000 / (10 ** 9) = 12000
    // Supply UXP : 2000000000 / (10 ** 6) = 20000

    // Price SOL : $15
    // Price UXP : $0.1

    // Price LP : $1*20000 + $1.8*12000 / 1500 = 21600 + 20000 / 1500 = 27.7

    await computeAndStoreLpPrice(
      cache,
      poolData,
      NetworkId.solana,
      'platformId'
    );

    const price = await cache.getTokenPrice(
      'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeNoT',
      NetworkId.solana
    );

    expect(price).not.toBeUndefined();
    expect(price?.price).toBeGreaterThan(27.5);
    expect(price?.price).toBeLessThan(28);
    expect(price?.underlyings?.length).toBe(2);
  });

  it('should not return an LP (low liquidity)', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });
    await cache.setTokenPriceSource({
      address: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      decimals: 6,
      id: 'UXP',
      networkId: NetworkId.solana,
      platformId: 'platformId',
      price: 1,
      timestamp: Date.now(),
      weight: 1,
    });
    await cache.setTokenPriceSource({
      address: networks.solana.native.address,
      decimals: networks.solana.native.decimals,
      id: 'SOL',
      networkId: NetworkId.solana,
      platformId: 'platformId',
      price: 1.8,
      timestamp: Date.now(),
      weight: 1,
    });

    const poolData: PoolData = {
      id: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeNoT',
      lpDecimals: 6,
      supply: new BigNumber('1500000000'),
      mintTokenX: networks.solana.native.address,
      mintTokenY: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      reserveTokenX: new BigNumber('1200000000000'),
      reserveTokenY: new BigNumber('2000000000'),
    };

    // Supply LP : 1500000000 / (10 ** 6) = 1500
    // Supply SOL : 1200000000000 / (10 ** 9) = 1200
    // Supply UXP : 2000000000 / (10 ** 6) = 2000

    // Price SOL : $15
    // Price UXP : $0.1

    // Price LP : $1*2000 + $1.8*1200 / 1500 = 2160 + 2000 / 1500 = 2.77

    await computeAndStoreLpPrice(
      cache,
      poolData,
      NetworkId.solana,
      'platformId'
    );

    const price = await cache.getTokenPrice(
      'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeNoT',
      NetworkId.solana
    );

    expect(price).toBeUndefined();
  });
});
