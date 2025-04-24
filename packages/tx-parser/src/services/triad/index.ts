import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'triad';

const contract = {
  name: 'Prediction Market',
  address: 'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}`,
  name: 'Prediction Market',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
