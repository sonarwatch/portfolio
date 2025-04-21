import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const service: Service = {
  id: `${platformId}-locker`,
  name: 'Locker',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const rewarderService: Service = {
  id: `${platformId}-Reward`,
  name: 'Reward',
  platformId,
  networkId: NetworkId.solana,
  contracts: [rewarderContract],
};
export const services: Service[] = [service, rewarderService];
export default services;
