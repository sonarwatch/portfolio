import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Fragmetric',
  address: 'fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3',
  platformId: 'fragmetric',
};

const service: ServiceDefinition = {
  id: 'fragmetric',
  name: 'Fragmetric',
  platformId: 'fragmetric',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
