import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'triad';

const contract = {
  name: 'Prediction Market',
  address: 'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss',
  platformId,
};

const service: Service = {
  id: `${platformId}`,
  name: 'Prediction Market',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
