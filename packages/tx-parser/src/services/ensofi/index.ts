import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'EnsoFi',
  address: 'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn',
  platformId: 'ensofi',
};

const service: Service = {
  id: 'ensofi',
  name: 'EnsoFi',
  platformId: 'ensofi',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
