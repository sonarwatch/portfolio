import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'haven';

const contract = {
  name: 'Leverage',
  address: 'AutoyKBRaHSBHy9RsmXCZMy6nNFAg5FYijrvZyQcNLV',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-leverage`,
  name: 'Leverage',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
