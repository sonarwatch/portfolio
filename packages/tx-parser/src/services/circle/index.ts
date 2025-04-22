import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'circle';
const lendingContract = {
  name: 'CCTP',
  address: 'CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3',
  platformId,
};

const lendingService: Service = {
  id: `${platformId}-cctp`,
  name: 'CCTP',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingContract],
};

export const services: Service[] = [lendingService];
export default services;
