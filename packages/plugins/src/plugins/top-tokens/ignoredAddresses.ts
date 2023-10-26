import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';

const ignoredAddresses: Map<NetworkIdType, string[]> = new Map([
  [
    NetworkId.ethereum,
    [
      '0x4da27a545c0c5B758a6BA100e3a049001de870f5', // stkAAVE
      '0xa1116930326D21fB917d5A27F1E9943A9595fb47', // stkABPT Aave
    ],
  ],
  [NetworkId.polygon, []],
  [NetworkId.avalanche, []],
  [NetworkId.bnb, []],
]);
export default ignoredAddresses;
