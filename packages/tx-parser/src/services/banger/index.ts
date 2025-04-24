import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'banger';
const contract = {
  name: 'Launch',
  address: 'BANGURqoS7pzE8MEtQrqxHPD9qYHfYdhCA7NVWPZvCtT',
  platformId,
};

const service: ServiceDefinition = {
  id: 'banger-launch',
  name: 'Launch',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
