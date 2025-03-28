import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const contract = {
  name: 'Exponent',
  address: 'ExponentnaRg3CQbW6dqQNZKXp7gtZ9DGMp1cwC4HAS7',
  platformId: 'exponent',
};

const service: Service = {
  id: 'exponent',
  name: 'Exponent',
  platformId: 'exponent',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
