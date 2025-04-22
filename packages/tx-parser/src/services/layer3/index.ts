import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'layer3';
const contract = {
  name: 'Staking',
  address: 'HE6bCtjsrra8DRbJnexKoVPSr5dYs57s3cuGHfotiQbq',
  platformId,
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};
export const services: Service[] = [stakingService];
export default services;
