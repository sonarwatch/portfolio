import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Francium',
  address: 'FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj',
  platformId: 'francium',
};

const service: Service = {
  id: 'francium',
  name: 'Francium',
  platformId: 'francium',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
