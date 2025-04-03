import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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
const stablePoolsService: Service = {
  id: `${platformId}-liquidity-pools-stable`,
  name: 'Stable Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stablePoolContract],
};
const weightedPoolsService: Service = {
  id: `${platformId}-liquidity-pools`,
  name: 'Weighted Pools',
  platformId,
  networkId: NetworkId.solana,
  contracts: [weghtedPoolContract],
};
const lpStakingService: Service = {
  id: `${platformId}-lp-staking`,
  name: 'LP Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: Service[] = [
  stablePoolsService,
  weightedPoolsService,
  lpStakingService,
];
export default services;
