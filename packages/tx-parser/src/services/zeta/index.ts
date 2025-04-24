import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const zetaContract = {
  name: 'Zeta',
  address: 'ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD',
  platformId: 'zeta',
};

const zetaService: ServiceDefinition = {
  id: 'zeta',
  name: 'Zeta',
  platformId: 'zeta',
  networkId: NetworkId.solana,
  contracts: [zetaContract],
};

const zetaStakingContract = {
  name: 'ZEX Staking',
  address: '4DUapvWZDDCkfWJpdwvX2QjwAE9Yq4wU8792RMMv7Csg',
  platformId: 'zeta',
};

const zetaStakingService: ServiceDefinition = {
  id: 'zeta-staking',
  name: 'ZEX Staking',
  platformId: 'zeta',
  networkId: NetworkId.solana,
  contracts: [zetaStakingContract],
};

export const services: ServiceDefinition[] = [zetaService, zetaStakingService];
export default services;
