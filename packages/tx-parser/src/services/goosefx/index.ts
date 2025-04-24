import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'goosefx';
const singleTokenPoolContract = {
  name: 'Single Token Pools',
  address: 'GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn',
  platformId,
};
const dualTokenPoolContract = {
  name: 'Dual Token Pools',
  address: 'GAMMA7meSFWaBXF25oSUgmGRwaW6sCMFLmBNiMSdbHVT',
  platformId,
};
const stakingContract = {
  name: 'Staking',
  address: 'STKRWxT4irmTthSJydggspWmkc3ovYHx62DHLPVv1f1',
  platformId,
};
const singleTokenPoolsService: ServiceDefinition = {
  id: `${platformId}-single-pools`,
  name: 'Single Token Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [singleTokenPoolContract],
};
const dualTokenPoolsService: ServiceDefinition = {
  id: `${platformId}-dual-pools`,
  name: 'Dual Token Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [dualTokenPoolContract],
};
const lpStakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [
  singleTokenPoolsService,
  dualTokenPoolsService,
  lpStakingService,
];
export default services;
