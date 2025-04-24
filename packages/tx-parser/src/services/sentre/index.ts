import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'sentre';
const contract = {
  name: 'Utility',
  address: '7oyG4wSf2kz2CxTqKTf1uhpPqrw9a8Av1w5t8Uj5PfXb',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-utility`,
  name: 'Utility',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
