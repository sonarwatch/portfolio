import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'citrus';
const lendingContract = {
  name: 'Lending',
  address: 'JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp',
  platformId,
};

const lendingService: Service = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingContract],
};

export const services: Service[] = [lendingService];
export default services;
