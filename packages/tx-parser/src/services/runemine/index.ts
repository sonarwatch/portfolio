import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'runemine';
const contract = {
  name: 'Staking',
  address: 'BpREyqp3WWfwQroVHvDknoXuh2P88CENMXrSCrGS4dis',
  platformId,
};

const service: ServiceDefinition = {
  id: 'runemine-staking',
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
