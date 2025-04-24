import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Lending',
  address: 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA',
  platformId: 'marginfi',
};

const service: ServiceDefinition = {
  id: 'marginfi-lending',
  name: 'Lending',
  platformId: 'marginfi',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
