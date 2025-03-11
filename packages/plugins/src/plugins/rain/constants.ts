import { PublicKey } from '@solana/web3.js';
import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Collection } from './types';

export const platformId = 'rain';
export const platform: Platform = {
  id: platformId,
  name: 'Rain',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/rain.webp',
  defiLlamaId: 'rain.fi', // from https://defillama.com/docs/api
  website: 'https://rain.fi/',
  twitter: 'https://twitter.com/RainFi_',
  discord: 'discord.gg/rainfi',
  medium: 'https://medium.com/@rainfi_',
  documentation: 'https://docs.rain.fi/',
  github: 'https://github.com/rain-foundation',
  description:
    'RainFi is a peer-to-peer (P2P) lending protocol built on the Solana blockchain, offering innovative ways for users to access and utilize financial resources.',
};

export const nftLendingProgramId = new PublicKey(
  'rNfTQD84kwMbcRpWpLR92BVmxbuwrZc3o5HTauAZiXs'
);
export const defiLendingProgramId = new PublicKey(
  'rDeFiHPjHZRLiz4iBzMw3zv6unZs4VwdU6qQcVd3NSK'
);
export const bankProgramId = new PublicKey(
  'rain2M5b9GeFCk792swkwUu51ZihHJb3SUQ8uHxSRJf'
);

export const rainApiV3 = 'https://api-v3.rain.fi/api/';

export const collectionsKey = 'collections';

export const collectionsMemo = new MemoizedCache<Collection[]>(collectionsKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});
