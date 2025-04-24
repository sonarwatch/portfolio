import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Marginfi',
  address: 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA',
  platformId: 'marginfi',
};

const service: ServiceDefinition = {
  id: 'marginfi',
  name: 'Marginfi',
  platformId: 'marginfi',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
