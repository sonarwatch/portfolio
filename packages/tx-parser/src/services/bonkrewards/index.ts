import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Staking',
  address: 'STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB',
  platformId: 'bonkrewards',
};

const service: ServiceDefinition = {
  id: 'bonkrewards-staking',
  name: 'Staking',
  platformId: 'bonkrewards',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
