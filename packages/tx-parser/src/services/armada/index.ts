import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'armada-staking-program';
const contract = {
  name: 'Staking',
  address: 'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1',
  platformId,
};

const service: Service = {
  id: `${platformId}-staking`,
  name: 'Permissionless Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
