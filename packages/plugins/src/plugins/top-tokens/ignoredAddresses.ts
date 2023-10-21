import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';

const ignoredAddresses: Map<NetworkIdType, string[]> = new Map([
  [
    NetworkId.ethereum,
    [
      '0x4da27a545c0c5b758a6ba100e3a049001de870f5', // stkAAVE
      '0xa1116930326d21fb917d5a27f1e9943a9595fb47', // stkABPT Aave
    ],
  ],
  [NetworkId.polygon, []],
  [NetworkId.avalanche, []],
]);
export default ignoredAddresses;
