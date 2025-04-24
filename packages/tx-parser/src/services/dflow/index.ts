import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'dflow';
export const contract = {
  name: 'Aggregator',
  address: 'DF1ow4tspfHX9JwWJsAb9epbkA8hmpSEAtxXy1V27QBH',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-aggregator`,
  name: 'Aggregator',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
