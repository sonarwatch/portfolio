import { NetworkId } from './Network';
import { TokenPriceSource, tokenPriceFromSources } from './TokenPrice';

describe('TokenPrice', () => {
  it('should works', async () => {
    const tokenAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
    const sourceA: TokenPriceSource = {
      address: tokenAddress,
      decimals: 0,
      id: 'sourceA',
      networkId: NetworkId.ethereum,
      platformId: 'platformId',
      price: 0.0000000789,
      timestamp: Date.now(),
      weight: 0.001,
    };
    const tokenPrice = tokenPriceFromSources([sourceA]);
    expect(tokenPrice?.price).toBe(0.0000000789);
  });
});
