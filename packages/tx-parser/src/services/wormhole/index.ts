import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const service: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const tokenBridgeService: Service = {
  id: `${platformId}-token-bridge`,
  name: 'Token Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [tokenBridgeContract],
};

const tokenBridgeRelayerService: Service = {
  id: `${platformId}-token-bridge-relayer`,
  name: 'Token Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [tokenBridgeRelayerContract],
};

const tbtcBridgeService: Service = {
  id: `${platformId}-tbtc-bridge`,
  name: 'tBTC Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [tbtcBridgeContract],
};

export const services: Service[] = [
  service,
  tokenBridgeService,
  tokenBridgeRelayerService,
  tbtcBridgeService,
];
export default services;
