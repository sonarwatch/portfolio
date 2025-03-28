import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Divvy',
  address: 'dvyFwAPniptQNb1ey4eM12L8iLHrzdiDsPPDndd6xAR',
  platformId: 'divvy',
};

const service: Service = {
  id: 'divvy',
  name: 'Divvy',
  platformId: 'divvy',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
