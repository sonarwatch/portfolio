import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'cudis';
const contract = {
  name: 'Main',
  address: 'H3tzuPeKMHd1Wee4JyuYbwKX6pHTcKGDgPw8caVNTvQu',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-main`,
  name: 'Main',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
