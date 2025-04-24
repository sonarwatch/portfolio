import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'stabble';
const weghtedPoolContract = {
  name: 'Weighted Pools',
  address: 'swapFpHZwjELNnjvThjajtiVmkz3yPQEHjLtka2fwHW',
  platformId,
};
const stablePoolContract = {
  name: 'Stable Pools',
  address: 'swapNyd8XiQwJ6ianp9snpu4brUqFxadzvHebnAXjJZ',
  platformId,
};
const stakingContract = {
  name: 'LP Staking',
  address: 'rev31KMq4qzt1y1iw926p694MHVVWT57caQrsHLFA4x',
  platformId,
};
const stablePoolsService: ServiceDefinition = {
  id: `${platformId}-liquidity-pools-stable`,
  name: 'Stable Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stablePoolContract],
};
const weightedPoolsService: ServiceDefinition = {
  id: `${platformId}-liquidity-pools`,
  name: 'Weighted Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [weghtedPoolContract],
};
const lpStakingService: ServiceDefinition = {
  id: `${platformId}-lp-staking`,
  name: 'LP Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [
  stablePoolsService,
  weightedPoolsService,
  lpStakingService,
];
export default services;
