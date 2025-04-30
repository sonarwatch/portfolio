import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'aurory';
const contract = {
  name: 'Staking',
  address: 'StKLLTf7CQ9n5BgXPSDXENovLTCuNc7N2ehvTb6JZ5x',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'STkwf3sbMapjy7KV3hgrJtcVvY4SvRxWQ8pj4Enw1i5',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
const stakingService2: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [stakingService, stakingService2];
export default services;
