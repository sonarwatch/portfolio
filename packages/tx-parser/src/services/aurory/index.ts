import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'aurory';
const contract = {
  name: 'Staking',
  address: 'StKLLTf7CQ9n5BgXPSDXENovLTCuNc7N2ehvTb6JZ5x',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [stakingService];
export default services;
