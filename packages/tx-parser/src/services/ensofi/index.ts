import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'ensofi';

const lendingContract: Contract = {
  name: 'Lending',
  address: 'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn',
  platformId,
};

const liquidityContract: Contract = {
  name: 'Liquidity',
  address: 'ensSuXMeaUhRC7Re3ukaxLcX2E4qmd2LZxbxsK9XcWz',
  platformId: 'ensofi',
};

const lendingService: ServiceDefinition = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingContract],
};

const liquidityService: ServiceDefinition = {
  id: `${platformId}-liquidity`,
  name: 'Liquidity',
  platformId,
  networkId: NetworkId.solana,
  contracts: [liquidityContract],
};

export const services: ServiceDefinition[] = [lendingService, liquidityService];
export default services;
