import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'boop';
const contract = {
  name: 'Staking',
  address: 'boopURdYr29D4C4BX7UWfi7rHQyinzCb4XRac3SHR85',
  platformId,
};

const poolContract = {
  name: 'Pool',
  address: 'boopiN5ZqKsQ1uCtQoPG7FeXVmJi7YcwngQQrZCp6qA',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, poolContract],
};

export const services: ServiceDefinition[] = [stakingService];
export default services;
