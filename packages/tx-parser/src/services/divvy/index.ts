import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Divvy',
  address: 'dvyFwAPniptQNb1ey4eM12L8iLHrzdiDsPPDndd6xAR',
  platformId: 'divvy',
};

const service: ServiceDefinition = {
  id: 'divvy',
  name: 'Divvy',
  platformId: 'divvy',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
