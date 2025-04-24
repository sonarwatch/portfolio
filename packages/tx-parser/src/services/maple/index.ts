import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'maple';
const contract = {
  name: 'Lending',
  address: '5D9yi4BKrxF8h65NkVE1raCCWFKUs5ngub2ECxhvfaZe',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
