import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'huma';
const contract = {
  name: 'Permissionless',
  address: 'HumaXepHnjaRCpjYTokxY4UtaJcmx41prQ8cxGmFC5fn',
  platformId,
};

const institutionalContract = {
  name: 'Institutional',
  address: 'EVQ4s1b6N1vmWFDv8PRNc77kufBP8HcrSNWXQAhRsJq9',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'vsRJM68m7i18PwzTFphgPYXTujCgxEi28knpUwSmg3q',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-permissionless`,
  name: 'Permissionless',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
const institutionalService: ServiceDefinition = {
  id: `${platformId}-institutional`,
  name: 'Institutional',
  platformId,
  networkId: NetworkId.solana,
  contracts: [institutionalContract],
};
const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [
  service,
  institutionalService,
  stakingService,
];
export default services;
