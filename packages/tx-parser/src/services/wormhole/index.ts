import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'wormhole';
const contract = {
  name: 'Staking',
  address: 'sspu65omPW2zJGWDxmx8btqxudHezoQHSGZmnW8jbVz',
  platformId,
};

const tokenBridgeContract = {
  name: 'Token Bridge',
  address: 'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const tokenBridgeService: ServiceDefinition = {
  id: `${platformId}-token-bridge`,
  name: 'Token Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [tokenBridgeContract],
};

export const services: ServiceDefinition[] = [service, tokenBridgeService];
export default services;
