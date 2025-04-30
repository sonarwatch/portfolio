import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'solincinerator';

const contract = {
  name: 'Incinerator',
  address: 'F6fmDVCQfvnEq2KR8hhfZSEczfM9JK9fWbCsYJNbTGn7',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-cleanup`,
  name: 'Cleanup',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
