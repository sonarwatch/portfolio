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

const tokenBridgeRelayerContract = {
  name: 'Token Bridge Relayer',
  address: '3vxKRPwUTiEkeUVyoZ9MXFe1V71sRLbLqu1gRYaWmehQ',
  platformId,
};

const tbtcBridgeContract = {
  name: 'tBTC Bridge',
  address: '87MEvHZCXE3ML5rrmh5uX1FbShHmRXXS32xJDGbQ7h5t',
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

const tokenBridgeRelayerService: ServiceDefinition = {
  id: `${platformId}-token-bridge-relayer`,
  name: 'Token Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [tokenBridgeRelayerContract],
};

const tbtcBridgeService: ServiceDefinition = {
  id: `${platformId}-tbtc-bridge`,
  name: 'tBTC Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [tbtcBridgeContract],
};

export const services: ServiceDefinition[] = [
  service,
  tokenBridgeService,
  tokenBridgeRelayerService,
  tbtcBridgeService,
];
export default services;
