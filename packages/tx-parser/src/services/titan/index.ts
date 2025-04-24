import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'titan';

const contract = {
  name: 'Swap',
  address: 'T1TANpTeScyeqVzzgNViGDNrkQ6qHz9KrSBS4aNXvGT',
  platformId,
};

const service: Service = {
  id: `${platformId}-swap`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
