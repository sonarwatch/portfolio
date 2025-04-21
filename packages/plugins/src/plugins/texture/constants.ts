import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Pair } from './types';
import { arrayToMap } from '../../utils/misc/arrayToMap';

export const platformId = 'texture';

export const programId = new PublicKey(
  'MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v'
);

export const pairsCacheKey = 'pairs';

export const pairsMemo = new MemoizedCache<Pair[], Map<string, Pair>>(
  pairsCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pair')
);
