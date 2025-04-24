import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'mayan';
const contract = {
  name: 'Swift',
  address: 'BLZRi6frs4X4DNLw56V4EXai1b6QVESN1BhHBTYM9VcY',
  platformId,
};

const service: Service = {
  id: `${platformId}-swift`,
  name: 'Swift',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
