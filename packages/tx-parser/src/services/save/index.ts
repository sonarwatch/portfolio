import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'save';
export const saveContract = {
  name: 'Lending',
  address: 'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo',
  platformId,
};

const wrapperContract = {
  name: 'Wrapper',
  address: '3JmCcXAjmBpFzHHuUpgJFfTQEQnAR7K1erNLtWV1g7d9',
  platformId,
};

const migrationContract = {
  name: 'Save Migration',
  address: 'S2SquuEfKRHm1riCj13WobJJzf3CgUwu7QmijxjpTfx',
  platformId,
};

const lendingService: ServiceDefinition = {
  id: `${platformId}-lending`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [saveContract],
};

const migrationService: ServiceDefinition = {
  id: `${platformId}-migration`,
  name: 'Migration',
  platformId,
  networkId: NetworkId.solana,
  contracts: [migrationContract],
};

const wrapperService: ServiceDefinition = {
  id: `${platformId}-wrapper`,
  name: 'Wrapper',
  platformId,
  networkId: NetworkId.solana,
  contracts: [wrapperContract],
};

export const services: ServiceDefinition[] = [
  lendingService,
  migrationService,
  wrapperService,
];
export default services;
