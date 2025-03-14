import { formatTokenAddress, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { getCachedDecimalsForToken } from './getCachedDecimalsForToken';

describe('getDecimalsForToken', () => {
  it('should use cache', async () => {
    const cache = new Cache({
      type: 'memory',
      params: {},
    });

    const networkId = NetworkId.sui;
    const address =
      '0x0ac4339286c11e75c35b63ded3d4a1920171ead6af77d25bd7bff7cfbd9fc641::movepump::MOVEPUMP';
    const expectedDecimals = 9;

    const suiDecimals = await getCachedDecimalsForToken(
      cache,
      address,
      networkId
    );

    expect(suiDecimals).not.toBeUndefined();
    expect(suiDecimals).toBe(expectedDecimals);

    const cachedSuiDecimals = await cache.getItem<number | null>(
      formatTokenAddress(address, networkId),
      {
        prefix: 'decimalsfortoken',
        networkId,
      }
    );

    expect(cachedSuiDecimals).not.toBeUndefined();
    expect(cachedSuiDecimals).toBe(expectedDecimals);

    const suiDecimals2 = await getCachedDecimalsForToken(
      cache,
      address,
      networkId
    );
    expect(suiDecimals2).not.toBeUndefined();
    expect(suiDecimals2).toBe(expectedDecimals);
  });
});
