import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';

export type RenzoContractConfig = {
  address: Address;
  assetName: string;
};

export type RenzoStakedContractConfig = RenzoContractConfig & {
  token: Address;
};

export type RenzoNetworkConfig = {
  networkId: EvmNetworkIdType;
  stakedContracts: RenzoStakedContractConfig[];
  activeStakeContract: RenzoStakedContractConfig;
  depositContract: RenzoContractConfig;
};
