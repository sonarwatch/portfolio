import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'pumpkin';
const contract = {
  name: 'Staking',
  address: 'ARFxpgenuFNbyoysFdqEwTgEdxtLtHbTHwCWHJjqWHTb',
  platformId,
};

const service: ServiceDefinition = {
  id: 'pumpkin-staking',
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
