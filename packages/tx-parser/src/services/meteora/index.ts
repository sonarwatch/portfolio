import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'meteora';

const meteoraVaultsContract: Contract = {
  name: `Vaults`,
  address: '24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi',
  platformId,
};
const meteoraPoolsContract: Contract = {
  name: `Pools`,
  address: 'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB',
  platformId,
};
const meteoraFarmsContract: Contract = {
  name: `Farms`,
  address: 'FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1',
  platformId,
};
const meteoraDlmmContract: Contract = {
  name: `DLMM`,
  address: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
  platformId,
};
const meteoraDlmmVaultsContract: Contract = {
  name: `DLMM Vaults`,
  address: 'vaU6kP7iNEGkbmPkLmZfGwiGxd4Mob24QQCie5R9kd2',
  platformId,
};
const m3m3Contract: Contract = {
  name: `M3M3 Staking`,
  address: 'FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP',
  platformId,
};

const dammV2Contract: Contract = {
  name: `AMM V2`,
  address: 'cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG',
  platformId,
};

export const bondingCurveContract: Contract = {
  name: `Bonding Curve`,
  address: 'dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN',
  platformId,
};

export const services: ServiceDefinition[] = [
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
    id: `${platformId}-damm-v2`,
    name: 'DAMM V2',
    platformId,
    networkId: NetworkId.solana,
    contracts: [dammV2Contract],
  },
  {
    id: `${platformId}-m3m3-staking`,
    name: 'Staking',
    platformId,
    networkId: NetworkId.solana,
    contracts: [m3m3Contract],
  },
  {
    id: `${platformId}-bonding-curve`,
    name: 'Bonding Curve',
    platformId,
    networkId: NetworkId.solana,
    contracts: [bondingCurveContract],
  },
];

export default services;
