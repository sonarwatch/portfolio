import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'zeta';
const mainContract = {
  name: 'Markets',
  address: 'ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD',
  platformId,
};

const mainService: ServiceDefinition = {
  id: `${platformId}-markets`,
  name: 'Markets',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

const stakingContract = {
  name: 'Staking',
  address: '4DUapvWZDDCkfWJpdwvX2QjwAE9Yq4wU8792RMMv7Csg',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [mainService, stakingService];
export default services;
