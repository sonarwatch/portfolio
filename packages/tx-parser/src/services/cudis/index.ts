import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'cudis';
const contract = {
  name: 'Data Minter',
  address: 'H3tzuPeKMHd1Wee4JyuYbwKX6pHTcKGDgPw8caVNTvQu',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-data-minter`,
  name: 'Data Minter',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
