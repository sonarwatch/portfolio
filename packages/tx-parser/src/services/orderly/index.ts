import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'orderly';

const contract: Contract = {
  name: `Orderly`,
  address: 'ErBmAD61mGFKvrFNaTJuxoPwqrS8GgtwtqJTJVjFWx9Q',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}`,
    name: 'Orderly',
    platformId,
    networkId: NetworkId.solana,
    contracts: [contract],
  },
];
export default services;
