import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'meteora';

const meteoraVaultsContract: Contract = {
  name: `Meteora Vaults`,
  address: '24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi',
  platformId,
};
const meteoraPoolsContract: Contract = {
  name: `Meteora Pools`,
  address: 'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB',
  platformId,
};
const meteoraFarmsContract: Contract = {
  name: `Meteora Farms`,
  address: 'FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1',
  platformId,
};
const meteoraDlmmContract: Contract = {
  name: `Meteora DLMM`,
  address: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
  platformId,
};
const meteoraDlmmVaultsContract: Contract = {
  name: `Meteora DLMM Vaults`,
  address: 'vaU6kP7iNEGkbmPkLmZfGwiGxd4Mob24QQCie5R9kd2',
  platformId,
};
const m3m3Contract: Contract = {
  name: `M3M3 Staking`,
  address: 'FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP',
  platformId,
};

export const services: Service[] = [
  {
    id: `${platformId}-vaults`,
    name: 'Vaults',
    platformId,
    networkId: NetworkId.solana,
    contracts: [meteoraVaultsContract],
  },
  {
    id: `${platformId}-pools`,
    name: 'Pools',
    platformId,
    networkId: NetworkId.solana,
    contracts: [meteoraPoolsContract],
  },
  {
    id: `${platformId}-farms`,
    name: 'Farms',
    platformId,
    networkId: NetworkId.solana,
    contracts: [meteoraFarmsContract],
  },
  {
    id: `${platformId}-dlmm`,
    name: 'DLMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [meteoraDlmmContract],
  },
  {
    id: `${platformId}-dlmm-vaults`,
    name: 'DLMM Vaults',
    platformId,
    networkId: NetworkId.solana,
    contracts: [meteoraDlmmVaultsContract],
  },
  {
    id: `${platformId}-m3m3-staking`,
    name: 'Staking',
    platformId,
    networkId: NetworkId.solana,
    contracts: [m3m3Contract],
  },
];

export default services;
