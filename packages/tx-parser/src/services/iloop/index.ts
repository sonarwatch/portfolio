import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'iloop';

const contract = {
  name: 'Lending',
  address: '3i8rGP3ex8cjs7YYWrQeE4nWizuaStsVNUXpRGtMbs3H',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
