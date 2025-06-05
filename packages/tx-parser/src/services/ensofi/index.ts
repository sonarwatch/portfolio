import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'ensofi';

const lendingContract: Contract = {
  name: 'Lending Fixed Terms',
  address: 'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn',
  platformId,
};

const lendingFlexContract: Contract = {
  name: 'Lending Flexible Terms',
  address: 'enseM1J4dGgwEw3qDyuVBi7YsjgwqvKzuX3ZLaboLGv',
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

const lendingFlexService: ServiceDefinition = {
  id: `${platformId}-lending-flex`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [lendingFlexContract],
};

const liquidityService: ServiceDefinition = {
  id: `${platformId}-liquidity`,
  name: 'Liquidity',
  platformId,
  networkId: NetworkId.solana,
  contracts: [liquidityContract],
};

export const services: ServiceDefinition[] = [
  lendingService,
  lendingFlexService,
  liquidityService,
];
export default services;
