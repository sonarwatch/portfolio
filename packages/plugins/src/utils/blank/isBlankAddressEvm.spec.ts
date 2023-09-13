import { NetworkId } from '@sonarwatch/portfolio-core';
import { isBlankAddressEvm } from './isBlankAddressEvm';

describe('isBlankAddressEvm', () => {
  it('should be blank address', async () => {
    const address = '0x407D73d8a49eeb85D32Cf465507dd71d507100c1';
    const isBlank = await isBlankAddressEvm(NetworkId.ethereum, address);
    expect(isBlank).toEqual(true);
  });
});
