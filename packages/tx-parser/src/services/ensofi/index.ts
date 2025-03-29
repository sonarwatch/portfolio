import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'ensofi';

const lendingContract: Contract = {
  name: 'Lending',
  address: 'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn',
  platformId,
};

const liquidityContract: Contract = {
  name: 'Liqudity',
  address: 'ensSuXMeaUhRC7Re3ukaxLcX2E4qmd2LZxbxsK9XcWz',
  platformId: 'ensofi',
};

const lendingService: Service = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingContract],
};

const liquidityService: Service = {
  id: `${platformId}-liquidity`,
  name: 'Liquidity',
  platformId,
  networkId: NetworkId.solana,
  contracts: [liquidityContract],
};

export const services: Service[] = [lendingService, liquidityService];
export default services;
