import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Marginfi',
  address: 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA',
  platformId: 'marginfi',
};

const service: Service = {
  id: 'marginfi',
  name: 'Marginfi',
  platformId: 'marginfi',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
