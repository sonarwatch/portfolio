import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';

const platformId = 'pumpfun';
const contract = {
  name: 'Launchpad',
  address: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-launchpad`,
  name: 'Launchpad',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
