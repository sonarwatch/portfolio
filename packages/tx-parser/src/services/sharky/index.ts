import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Sharky',
  address: 'SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP',
  platformId: 'sharky',
};

const service: ServiceDefinition = {
  id: 'sharky',
  name: 'Sharky',
  platformId: 'sharky',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
