import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'backwoods';
const contract = {
  name: 'Game',
  address: 'H5RnrnQFVYiGCsGomawwyZ1gJgmMsSXDYbpidZredcGZ',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-game`,
  name: 'Game',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
