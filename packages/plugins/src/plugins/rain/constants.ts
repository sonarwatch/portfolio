import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Collection } from './types';

export const platformId = 'rain';

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
