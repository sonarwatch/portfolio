import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Francium',
  address: 'FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj',
  platformId: 'francium',
};

const service: ServiceDefinition = {
  id: 'francium',
  name: 'Francium',
  platformId: 'francium',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
