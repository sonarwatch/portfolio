import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'allbridge';
const contract = {
  name: 'Bridge',
  address: 'BrdgN2RPzEMWF96ZbnnJaUtQDQx7VRXYaHHbYCBvceWB',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'stk8xj8cygGKnFoLE1GL8vHABcHUbYrnPCkxdL5Pr2q',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bridge`,
  name: 'Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [service, stakingService];
export default services;
