import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'titan';

const contract = {
  name: 'Swap',
  address: 'T1TANpTeScyeqVzzgNViGDNrkQ6qHz9KrSBS4aNXvGT',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-swap`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
