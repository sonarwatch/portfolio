import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Picasso',
  address: '8n3FHwYxFgQCQc2FNFkwDUf9mcqupxXcCvgfHbApMLv3',
  platformId: 'picasso',
};

export const service: Service = {
  id: 'picasso',
  name: 'Picasso',
  platformId: 'picasso',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
