import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'lifinity';
const contract = {
  name: 'Locker',
  address: 'LLoc8JX5dLAMVzbzTNKG6EFpkyJ9XCsVAGkqwQKUJoa',
  platformId,
};

const rewarderContract = {
  name: 'Rewarder',
  address: 'LRewdYDnxyP9HXCL6DQYgTaeL9FKb5Pc8Gr4UbVrtnj',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-locker`,
  name: 'Locker',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const rewarderService: ServiceDefinition = {
  id: `${platformId}-Reward`,
  name: 'Reward',
  platformId,
  networkId: NetworkId.solana,
  contracts: [rewarderContract],
};
export const services: ServiceDefinition[] = [service, rewarderService];
export default services;
