import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';

export type StgConfig = {
  networkId: EvmNetworkIdType;
  poolsContract: `0x${string}`;
  farmsContract: `0x${string}`;
  votingEscrow: `0x${string}`;
  stgAddress: `0x${string}`;
};
