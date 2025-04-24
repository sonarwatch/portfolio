import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const defiTunaContract = {
  name: 'DefiTuna',
  address: 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD',
  platformId: 'defituna',
};

const defiTunaService: ServiceDefinition = {
  id: 'defituna',
  name: 'Lending',
  platformId: 'defituna',
  networkId: NetworkId.solana,
  contracts: [defiTunaContract],
};

export const services: ServiceDefinition[] = [defiTunaService];
export default services;
