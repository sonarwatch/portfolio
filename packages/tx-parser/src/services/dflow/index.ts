import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'dflow';
export const contract = {
  name: 'Aggregator',
  address: 'DF1ow4tspfHX9JwWJsAb9epbkA8hmpSEAtxXy1V27QBH',
  platformId,
};

const service: Service = {
  id: `${platformId}-aggregator`,
  name: 'Aggregator',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
