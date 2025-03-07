import { PublicKey } from '@solana/web3.js';
import {
  Contract,
  NetworkId,
  Platform,
  Service,
} from '@sonarwatch/portfolio-core';

export const platformId = 'meteora';
export const platform: Platform = {
  id: 'meteora',
  name: 'Meteora',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/meteora.webp',
  defiLlamaId: 'parent#meteora',
  website: 'https://meteora.ag/',
  github: 'https://github.com/MeteoraAg',
  documentation: 'https://docs.meteora.ag/',
  discord: 'https://discord.gg/WwFwsVtvpH',
  description: 'Building the most dynamic liquidity protocols in DeFi.',
  twitter: 'https://x.com/MeteoraAG',
};

export const prefixVaults = `${platformId}-vaults`;
export const farmsKey = 'farms';
export const dlmmVaultsKey = 'dlmm-vaults-1';
export const feeVaultsKey = 'fee-vaults';

const meteoraVaultsContract: Contract = {
  name: `${platform.name} Vaults`,
  address: '24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi',
};
const meteoraPoolsContract: Contract = {
  name: `${platform.name} Pools`,
  address: 'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB',
};
const meteoraFarmsContract: Contract = {
  name: `${platform.name} Farms`,
  address: 'FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1',
};
const meteoraDlmmContract: Contract = {
  name: `${platform.name} DLMM`,
  address: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
};
const meteoraDlmmVaultsContract: Contract = {
  name: `${platform.name} DLMM Vaults`,
  address: 'vaU6kP7iNEGkbmPkLmZfGwiGxd4Mob24QQCie5R9kd2',
};
const m3m3Contract: Contract = {
  name: `M3M3 Staking`,
  address: 'FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP',
};

export const vaultsProgramId = new PublicKey(meteoraVaultsContract.address);
export const poolsProgramId = new PublicKey(meteoraPoolsContract.address);
export const farmProgramId = new PublicKey(meteoraFarmsContract.address);
export const dlmmProgramId = new PublicKey(meteoraDlmmContract.address);
export const dlmmVaultProgramId = new PublicKey(
  meteoraDlmmVaultsContract.address
);
export const stakeForFeeProgramId = new PublicKey(m3m3Contract.address);

export const pluginServices: Service[] = [
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
