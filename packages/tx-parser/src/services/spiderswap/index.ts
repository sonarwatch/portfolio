import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'spdr';
const contract = {
  name: 'Staking',
  address: 'GTavkffQHnDKDH36YNFpk7uxwHNseTRo24tV4HGC8MNY',
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
