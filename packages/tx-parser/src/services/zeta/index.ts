import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const zetaContract = {
  name: 'Zeta',
  address: 'ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD',
  platformId: 'zeta',
};

export const zetaService: Service = {
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

export const zetaStakingService: Service = {
  id: 'zeta-staking',
  name: 'ZEX Staking',
  platformId: 'zeta',
  networkId: NetworkId.solana,
  contracts: [zetaStakingContract],
};

export const services: Service[] = [zetaService, zetaStakingService];
export default services;
