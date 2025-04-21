import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'runemine';
const contract = {
  name: 'Staking',
  address: 'BpREyqp3WWfwQroVHvDknoXuh2P88CENMXrSCrGS4dis',
  platformId,
};

const service: Service = {
  id: 'runemine-staking',
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
