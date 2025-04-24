import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'citrus';
const lendingContract = {
  name: 'Lending',
  address: 'JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp',
  platformId,
};

const lendingService: ServiceDefinition = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingContract],
};

export const services: ServiceDefinition[] = [lendingService];
export default services;
