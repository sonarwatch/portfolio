import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';

const forcedAddresses: Map<NetworkIdType, string[]> = new Map([
  [NetworkId.ethereum, ['0xBe9895146f7AF43049ca1c1AE358B0541Ea49704']],
]);
export default forcedAddresses;
