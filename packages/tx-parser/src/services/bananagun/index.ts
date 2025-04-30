import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'banana-gun';
const contract = {
  name: 'Router',
  address: 'BANANAjs7FJiPQqJTGFzkZJndT9o7UmKiYYGaJz6frGu',
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
