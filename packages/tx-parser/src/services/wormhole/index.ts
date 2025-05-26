import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

const platformId = 'wormhole';

const mainContract = {
  name: 'Main',
  address: 'HDwcJBJXjL9FpJ7UBsYBtaDjsBUhuLCUYoz3zr8SWWaQ',
  platformId,
};

const coreContract = {
  name: 'Core',
  address: 'worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth',
  platformId,
};

const legacyStakingContract = {
  name: 'Legacy Staking',
  address: 'sspu65omPW2zJGWDxmx8btqxudHezoQHSGZmnW8jbVz',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B',
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

const legacyStakingService: ServiceDefinition = {
  id: `${platformId}-legacy-staking`,
  name: 'Legacy Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [legacyStakingContract],
  priority: ServicePriority.low,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

const wormholeService: ServiceDefinition = {
  id: `${platformId}-main`,
  name: 'Core',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      mainContract.address,
      coreContract.address,
    ]),
};

const tokenBridgeService: ServiceDefinition = {
  id: `${platformId}-token-bridge`,
  name: 'Token Bridge',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      tokenBridgeContract.address,
      tokenBridgeRelayerContract.address,
    ]),
};

const tbtcBridgeService: ServiceDefinition = {
  id: `${platformId}-tbtc-bridge`,
  name: 'tBTC Bridge',
  platformId,
  networkId: NetworkId.solana,
  contracts: [tbtcBridgeContract],
};

export const services: ServiceDefinition[] = [
  wormholeService,
  legacyStakingService,
  stakingService,
  tokenBridgeService,
  tbtcBridgeService,
];
export default services;
