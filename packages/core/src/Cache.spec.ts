import memoryDriver from 'unstorage/drivers/memory';
import { Cache } from './Cache';
import sleep from './helpers/sleep';
import { TokenPriceSource } from './TokenPrice';
import { NetworkId } from './Network';

describe('Cache', () => {
  it('should works', () => {
    expect(true).toBeTruthy();
  });

  it('should set token price sources', async () => {
    const driver = memoryDriver();
    const cache = new Cache(driver);
    const sourceA: TokenPriceSource = {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      decimals: 9,
      id: 'sourceA',
      isBase: true,
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
});
