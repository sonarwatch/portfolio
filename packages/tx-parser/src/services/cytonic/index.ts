import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'cytonic';

const solanaContract = {
  name: 'Main',
  address: 'HYDqq5GfUj4aBuPpSCs4fkmeS7jZHRhrrQ3q72KsJdD4',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-solana`,
  name: 'Solana',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solanaContract],
};
export const services: ServiceDefinition[] = [service];
export default services;
