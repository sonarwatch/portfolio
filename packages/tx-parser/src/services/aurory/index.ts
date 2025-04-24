import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'aurory';
const contract = {
  name: 'Staking',
  address: 'StKLLTf7CQ9n5BgXPSDXENovLTCuNc7N2ehvTb6JZ5x',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [stakingService];
export default services;
