import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'sanctum';
const voteContract = {
  name: 'Vote',
  address: 'VAU1T7S5UuEHmMvXtXMVmpEoQtZ2ya7eRb7gcN47wDp',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'bon4Kh3x1uQK16w9b9DKgz3Aw4AP1pZxBJk55Q6Sosb',
  platformId,
};

const voteService: Service = {
  id: 'sanctum-vote',
  name: 'Vote',
  platformId,
  networkId: NetworkId.solana,
  contracts: [voteContract],
};

const stakingService: Service = {
  id: 'sanctum-staking',
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: Service[] = [voteService, stakingService];
export default services;
