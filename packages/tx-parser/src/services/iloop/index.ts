import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'iloop';

const contract = {
  name: 'Lending',
  address: '3i8rGP3ex8cjs7YYWrQeE4nWizuaStsVNUXpRGtMbs3H',
  platformId,
};

const service: Service = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
