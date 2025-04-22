import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'guano';
const contract = {
  name: 'Staking',
  address: 'CFjLE5589EiPZvPFiSx7QgktBH8ZTkkGJU2dL7qbJU2a',
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
