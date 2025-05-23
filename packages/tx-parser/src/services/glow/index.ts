import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'glow';

const contract = {
  name: 'Markets',
  address: 'GLoWMgcn3VbyFKiC2FGMgfKxYSyTJS7uKFwKY2CSkq9X',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-markets`,
  name: 'Markets',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
