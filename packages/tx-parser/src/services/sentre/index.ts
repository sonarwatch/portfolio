import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'sentre';
const contract = {
  name: 'Utility',
  address: '7oyG4wSf2kz2CxTqKTf1uhpPqrw9a8Av1w5t8Uj5PfXb',
  platformId,
};

const service: Service = {
  id: `${platformId}-utility`,
  name: 'Utility',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
