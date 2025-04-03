import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';

export type RenzoContractConfig = {
  address: `0x${string}`;
};

export type RenzoStakedContractConfig = RenzoContractConfig & {
  token: `0x${string}`;
};

export type RenzoNetworkConfig = {
  networkId: EvmNetworkIdType;
  stakedContracts: RenzoStakedContractConfig[];
  activeStakeContract: RenzoStakedContractConfig;
  depositContract: RenzoContractConfig;
};
