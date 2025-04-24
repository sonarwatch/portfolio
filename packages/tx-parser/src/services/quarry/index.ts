import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'quarry';
const contract = {
  name: 'Mine',
  address: 'QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB',
  platformId,
};

const mergeContract = {
  name: 'Merge Mine',
  address: 'QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto',
  platformId,
};

const minerService: ServiceDefinition = {
  id: `${platformId}-miner`,
  name: 'Miner',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const mergeMinerService: ServiceDefinition = {
  id: `${platformId}-merge-miner`,
  name: 'Merge Miner',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mergeContract],
};

export const services: ServiceDefinition[] = [minerService, mergeMinerService];
export default services;
