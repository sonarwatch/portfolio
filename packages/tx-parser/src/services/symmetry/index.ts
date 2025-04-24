import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Symmetry',
  address: '2KehYt3KsEQR53jYcxjbQp2d2kCp4AkuQW68atufRwSr',
  platformId: 'symmetry',
};

const service: ServiceDefinition = {
  id: 'symmetry',
  name: 'Symmetry',
  platformId: 'symmetry',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
