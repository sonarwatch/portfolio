import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'genesysgo';

const stakingContract = {
  name: 'Staking',
  address: 'AvqeyEDqW9jaBi7yrRA6AxJtLbMzRY9NX75HuPTMoS4i',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [stakingService];
export default services;
