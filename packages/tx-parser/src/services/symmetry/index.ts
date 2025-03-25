import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Symmetry',
  address: '2KehYt3KsEQR53jYcxjbQp2d2kCp4AkuQW68atufRwSr',
  platformId: 'symmetry',
};

const service: Service = {
  id: 'symmetry',
  name: 'Symmetry',
  platformId: 'symmetry',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
