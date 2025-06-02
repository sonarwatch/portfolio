import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const stakingContract = {
  name: 'Staking',
  address: 'DQtwoVmEgaGe3hCuefpnBR1rjtLJLJ7sKjVZbUEsSseC',
  platformId: 'spice',
};

const stakingService: ServiceDefinition = {
  id: 'spice-staking',
  name: 'Spice',
  platformId: 'spice',
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [stakingService];
export default services;
