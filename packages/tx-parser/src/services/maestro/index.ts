import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'maestro';
const contract = {
  name: 'Router',
  address: 'MaestroAAe9ge5HTc64VbBQZ6fP77pwvrhM8i1XWSAx',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bot`,
  name: 'Bot',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
