import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'maple';
const contract = {
  name: 'Lending',
  address: '5D9yi4BKrxF8h65NkVE1raCCWFKUs5ngub2ECxhvfaZe',
  platformId,
};

const service: Service = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
