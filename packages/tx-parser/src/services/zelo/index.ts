import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'zelo';
const stakingContract = {
  name: 'Staking',
  address: '3weDTR2PBop8SoYXpQEhdRCA9Wr2JK7gj3CxuUbMo2VJ',
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
