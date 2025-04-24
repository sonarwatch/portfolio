import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'mayan';
const contract = {
  name: 'Swift',
  address: 'BLZRi6frs4X4DNLw56V4EXai1b6QVESN1BhHBTYM9VcY',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-swift`,
  name: 'Swift',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
