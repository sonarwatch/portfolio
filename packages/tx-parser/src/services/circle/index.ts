import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'circle';
const lendingContract = {
  name: 'CCTP',
  address: 'CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3',
  platformId,
};

const lendingService: ServiceDefinition = {
  id: `${platformId}-cctp`,
  name: 'CCTP',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingContract],
};

export const services: ServiceDefinition[] = [lendingService];
export default services;
