import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'layer3';
const contract = {
  name: 'Staking',
  address: 'HE6bCtjsrra8DRbJnexKoVPSr5dYs57s3cuGHfotiQbq',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
export const services: ServiceDefinition[] = [stakingService];
export default services;
