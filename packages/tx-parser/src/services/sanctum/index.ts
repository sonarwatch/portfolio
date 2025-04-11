import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'sanctum';
const contract = {
  name: 'Sanctum DAO',
  address: 'VAU1T7S5UuEHmMvXtXMVmpEoQtZ2ya7eRb7gcN47wDp',
  platformId,
};

const service: Service = {
  id: 'sanctum-dao',
  name: 'Sanctum DAO',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
