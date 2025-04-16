import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'sanctum';
const contract = {
  name: 'Vote',
  address: 'VAU1T7S5UuEHmMvXtXMVmpEoQtZ2ya7eRb7gcN47wDp',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'bon4Kh3x1uQK16w9b9DKgz3Aw4AP1pZxBJk55Q6Sosb',
  platformId,
};

const service: Service = {
  id: 'sanctum-dao',
  name: 'Sanctum DAO',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract, stakingContract],
};

export const services: Service[] = [service];
export default services;
