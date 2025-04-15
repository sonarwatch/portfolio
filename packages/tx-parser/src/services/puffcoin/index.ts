import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'puffcoin';
const contract = {
  name: 'Staking',
  address: 'q8gz8Sww7Xexpqk9DrEMjNXMHnFx6dB3EYe32PwHHd6',
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
