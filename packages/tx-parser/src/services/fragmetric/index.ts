import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Fragmetric',
  address: 'fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3',
  platformId: 'fragmetric',
};

const airdropContract = {
  name: 'Airdrop',
  address: 'fdropWhSi5xVKa9z26qKXveXoHDePDXfb5zxt3RKvKx',
  platformId: 'fragmetric',
};

const service: ServiceDefinition = {
  id: 'fragmetric',
  name: 'Fragmetric',
  platformId: 'fragmetric',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const airdropService: ServiceDefinition = {
  id: 'fragmetric-airdrop',
  name: 'Fragmetric Airdrop',
  platformId: 'fragmetric',
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

export const services: ServiceDefinition[] = [service, airdropService];
export default services;
