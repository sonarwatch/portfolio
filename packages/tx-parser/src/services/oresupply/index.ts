import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const service: Service = {
  id: `${platformId}-mining`,
  name: 'Mining',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: Service[] = [service, stakingService];
export default services;
