import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'solana';

export const solanaStakingContract = {
  name: 'Staking',
  address: 'Stake11111111111111111111111111111111111111',
  platformId,
};

export const associatedTokenContract = {
  name: 'Associated Token Account',
  address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  platformId,
};

export const solanaStakingService: ServiceDefinition = {
  id: `${platformId}-stake`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solanaStakingContract],
};

export const services: ServiceDefinition[] = [solanaStakingService];
export default services;
