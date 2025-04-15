import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'sonic';
const contract = {
  name: 'Staking',
  address: 'g3yMgSB3Q7gNjMfSoCm1PiJihqHdNJeUuPHvRyf45qY',
  platformId,
};

const service: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
