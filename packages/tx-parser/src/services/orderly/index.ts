import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'orderly';

const contract: Contract = {
  name: `Orderly`,
  address: 'ErBmAD61mGFKvrFNaTJuxoPwqrS8GgtwtqJTJVjFWx9Q',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}`,
    name: 'Orderly',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract],
  },
];
export default services;
