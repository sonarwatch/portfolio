import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const service: Service = {
  id: `${platformId}-governance`,
  name: 'Governance',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const restakingService: Service = {
  id: `${platformId}-restaking`,
  name: 'Restaking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [restakingContract],
};

export const services: Service[] = [service, restakingService];
export default services;
