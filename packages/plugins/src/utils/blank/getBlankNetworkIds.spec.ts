import { AddressSystem } from '@sonarwatch/portfolio-core';
import { getBlankNetworkIds } from './getBlankNetworkIds';

describe('getBlankNetworkIds', () => {
  it('should be blank addresses', async () => {
    const address = '0x796fb5ff91099467f7669c8fb0c68739fd3a9e42';
    const isBlank = await getBlankNetworkIds(address, AddressSystem.evm);
    expect(isBlank.length).toBeGreaterThan(0);
  });
});
