import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ReserveInfo, Pair } from './types';
import { arrayToMap } from '../../utils/misc/arrayToMap';

export const platformId = 'texture';

export const lendyProgramId = new PublicKey(
  'MLENdNkmK61mGd4Go8BJX9PhYPN3azrAKRQsAC7u55v'
);
export const superlendyProgramId = new PublicKey(
  'sUperbZBsdZa4s7pWPKQaQ2fRTesjKxupxagZ8FSgVi'
);
export const vaultProgramId = new PublicKey(
  'Vau3BGKpqWi24LHwVQnVvd31ATGLQ3YmpUJ1DYTdgQs'
);

export const pairsCacheKey = 'pairs';
export const reservesCacheKey = 'reserves';

export const pairsMemo = new MemoizedCache<Pair[], Map<string, Pair>>(
  pairsCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pair')
);

export const reservesMemo = new MemoizedCache<
  ReserveInfo[],
  Map<string, ReserveInfo>
>(
  reservesCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pubkey')
);
