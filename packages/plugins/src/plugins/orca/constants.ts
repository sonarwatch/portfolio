import { PublicKey } from '@solana/web3.js';
import {
  Contract,
  NetworkId,
  Platform,
  Service,
} from '@sonarwatch/portfolio-core';

export const platformId = 'orca';
export const platform: Platform = {
  id: platformId,
  name: 'Orca',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/orca.webp',
  defiLlamaId: 'orca',
  website: 'https://www.orca.so/',
  discord: 'https://discord.orca.so/',
  github: 'https://github.com/orca-so',
  twitter: 'https://twitter.com/orca_so',
  medium: 'https://orca-so.medium.com/',
  documentation: 'https://docs.orca.so/',
  description:
    'Orca is the go-to place to trade tokens and provide liquidity on Solana',
};

export const orcaStakingPlatformId = 'orca-staking';
export const orcaStakingPlatform: Platform = {
  id: orcaStakingPlatformId,
  name: 'Orca Staking',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/orca.webp',
  website: 'https://v1.orca.so/staking',
};

const poolsContract: Contract = {
  name: `${platform.name} Pools`,
  address: '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP',
};
const aquaFarmsContract: Contract = {
  name: `${platform.name} Aqua Farms`,
  address: '82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ',
};
const whirlpoolContract: Contract = {
  name: `${platform.name} Whirlpool`,
  address: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
};

export const poolsProgram = new PublicKey(poolsContract.address);
export const aquafarmsProgram = new PublicKey(aquaFarmsContract.address);
export const whirlpoolProgram = new PublicKey(whirlpoolContract.address);

export const positionsIdentifiers = ['Orca Whirlpool Position', 'OWP'];
export const whirlpoolPrefix = `${platformId}-whirlpool`;
export const pluginServices: Service[] = [
  {
    id: `${platformId}-pools`,
    name: 'Pools',
    platformId,
    networkId: NetworkId.solana,
    contracts: [poolsContract],
  },
  {
    id: `${platformId}-farms`,
    name: 'Aqua Farms',
    platformId,
    networkId: NetworkId.solana,
    contracts: [aquaFarmsContract],
  },
  {
    id: `${platformId}-whirlpools`,
    name: 'Whirlpools',
    platformId,
    networkId: NetworkId.solana,
    contracts: [whirlpoolContract],
  },
];
