import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'oresupply';
const contract = {
  name: 'Mining',
  address: 'poo1sKMYsZtDDS7og73L68etJQYyn6KXhXTLz1hizJc',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'BoostzzkNfCA9D1qNuN5xZxB5ErbK4zQuBeTHGDpXT1',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-mining`,
  name: 'Mining',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [service, stakingService];
export default services;
