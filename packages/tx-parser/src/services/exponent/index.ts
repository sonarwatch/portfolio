import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Core',
  address: 'ExponentnaRg3CQbW6dqQNZKXp7gtZ9DGMp1cwC4HAS7',
  platformId: 'exponent',
};

const service: ServiceDefinition = {
  id: 'exponent',
  name: 'Core',
  platformId: 'exponent',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
