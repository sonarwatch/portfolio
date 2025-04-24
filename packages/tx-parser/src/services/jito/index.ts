import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'jito';

const contract = {
  name: 'Governance',
  address: 'jtogvBNH3WBSWDYD5FJfQP2ZxNTuf82zL8GkEhPeaJx',
  platformId,
};

const restakingContract = {
  name: 'Restaking',
  address: 'Vau1t6sLNxnzB7ZDsef8TLbPLfyZMYXH8WTNqUdm9g8',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-governance`,
  name: 'Governance',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const restakingService: ServiceDefinition = {
  id: `${platformId}-restaking`,
  name: 'Restaking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [restakingContract],
};

export const services: ServiceDefinition[] = [service, restakingService];
export default services;
