import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const contract = {
  name: 'Perena',
  address: 'NUMERUNsFCP3kuNmWZuXtm1AaQCPj9uw6Guv2Ekoi5P',
  platformId: 'perena',
};

const service: ServiceDefinition = {
  id: 'perena',
  name: 'Numéraire',
  platformId: 'perena',
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
