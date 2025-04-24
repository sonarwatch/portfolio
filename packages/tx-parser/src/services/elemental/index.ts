import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Elemental',
  address: 'ELE5vYY81W7UCpTPs7SyD6Bwm5FwZBntTW8PiGqM5d4A',
  platformId: 'elemental',
};

const service: ServiceDefinition = {
  id: 'elemental',
  name: 'Elemental',
  platformId: 'elemental',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
