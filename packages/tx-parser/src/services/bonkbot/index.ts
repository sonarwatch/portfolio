import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'bonkbot';
const contract = {
  name: 'Router',
  address: 'CxvksNjwhdHDLr3qbCXNKVdeYACW8cs93vFqLqtgyFE5',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bot`,
  name: 'Trading',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
