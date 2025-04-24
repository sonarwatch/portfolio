import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'armada-staking-program';
const contract = {
  name: 'Staking',
  address: 'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Permissionless Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
