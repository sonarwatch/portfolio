import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';

const platformId = 'metaplex';

const coreContract: Contract = {
  name: `Core`,
  address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
  platformId,
};

export const metaplexContract: Contract = {
  name: `Token Metadata`,
  address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  platformId,
};

export const bubblegumContract: Contract = {
  name: `Bubblegum (cNFT)`,
  address: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-cnft`,
    name: 'Bubblegum (cNFT)',
    platformId,
    networkId: NetworkId.solana,
    contracts: [bubblegumContract],
    priority: ServicePriority.low,
  },
  {
    id: `${platformId}-metadata`,
    name: 'Token Metadata',
    platformId,
    networkId: NetworkId.solana,
    contracts: [metaplexContract],
    priority: ServicePriority.low,
  },
  {
    id: `${platformId}-core`,
    name: 'Core',
    platformId,
    networkId: NetworkId.solana,
    contracts: [coreContract],
    priority: ServicePriority.low,
  },
];

export default services;
