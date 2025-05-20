import { formatTokenAddress, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { getCachedDecimalsForToken } from './getCachedDecimalsForToken';

describe('getDecimalsForToken', () => {
  it('should use cache', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });

    const networkId = NetworkId.solana;
    const address = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN';
    const expectedDecimals = 6;

    const onchainDecimals = await getCachedDecimalsForToken(
      cache,
      address,
      networkId
    );

    expect(onchainDecimals).not.toBeUndefined();
    expect(onchainDecimals).toBe(expectedDecimals);

    const cachedOnChainDecimals = await cache.getItem<number | null>(
      formatTokenAddress(address, networkId),
      {
        prefix: 'decimalsfortoken',
        networkId,
      }
    );

    expect(cachedOnChainDecimals).not.toBeUndefined();
    expect(cachedOnChainDecimals).toBe(expectedDecimals);

    const onchainDecimals2 = await getCachedDecimalsForToken(
      cache,
      address,
      networkId
    );
    expect(onchainDecimals2).not.toBeUndefined();
    expect(onchainDecimals2).toBe(expectedDecimals);
  });
});
