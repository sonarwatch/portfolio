import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Sharky',
  address: 'SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP',
  platformId: 'sharky',
};

export const service: Service = {
  id: 'sharky',
  name: 'Sharky',
  platformId: 'sharky',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
