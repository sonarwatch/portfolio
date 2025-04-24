import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Picasso',
  address: '8n3FHwYxFgQCQc2FNFkwDUf9mcqupxXcCvgfHbApMLv3',
  platformId: 'picasso',
};

const service: ServiceDefinition = {
  id: 'picasso',
  name: 'Picasso',
  platformId: 'picasso',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
