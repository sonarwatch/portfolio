import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';

const platformId = 'sanctum';
const poolContract = {
  name: 'Infinity Pool',
  address: '5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx',
  platformId,
};

const infContract = {
  name: 'Infinity',
  address: '5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx',
  platformId,
};

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

const routerContract = {
  name: 'Router',
  address: 'stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq',
  platformId,
};

const voteService: ServiceDefinition = {
  id: `${platformId}-vote`,
  name: 'Vote',
  platformId,
  networkId: NetworkId.solana,
  contracts: [voteContract],
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

const poolService: ServiceDefinition = {
  id: `${platformId}-pool`,
  name: 'Infinity Pool',
  platformId,
  networkId: NetworkId.solana,
  contracts: [poolContract],
};

const routerService: ServiceDefinition = {
  id: `${platformId}-router`,
  name: 'Router',
  platformId,
  priority: ServicePriority.low,
  networkId: NetworkId.solana,
  contracts: [routerContract],
};

const tradeService: ServiceDefinition = {
  id: `${platformId}-trade`,
  name: 'Trade',
  platformId,
  networkId: NetworkId.solana,
  contracts: [infContract],
};

export const services: ServiceDefinition[] = [
  voteService,
  stakingService,
  poolService,
  routerService,
  tradeService,
];
export default services;
