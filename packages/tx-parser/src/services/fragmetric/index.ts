import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Fragmetric',
  address: 'fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3',
  platformId: 'fragmetric',
};

const service: Service = {
  id: 'fragmetric',
  name: 'Fragmetric',
  platformId: 'fragmetric',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
