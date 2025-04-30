import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'uxd';

const stakingContract = {
  name: 'Staking',
  address: 'UXDSkps5NR8Lu1HB5uPLFfuB34hZ6DCk7RhYZZtGzbF',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};
export const services: ServiceDefinition[] = [service];
export default services;
