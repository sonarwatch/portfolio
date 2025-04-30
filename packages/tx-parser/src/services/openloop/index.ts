import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'openloop';
const contract = {
  name: 'Sentry Node',
  address: '2KJeTEHuZrkBTonJyTzuA5oKY3q6moEef2haNbY6evVZ',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-sentry-node`,
  name: 'Sentry Node',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
