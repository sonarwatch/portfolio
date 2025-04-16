import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'lifinity';
const contract = {
  name: 'Locker',
  address: 'LLoc8JX5dLAMVzbzTNKG6EFpkyJ9XCsVAGkqwQKUJoa',
  platformId,
};

const service: Service = {
  id: `${platformId}-locker`,
  name: 'Locker',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
