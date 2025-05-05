import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Market } from './types';

export const platformId = 'exponent';

export const exponentCoreProgram = new PublicKey(
  'ExponentnaRg3CQbW6dqQNZKXp7gtZ9DGMp1cwC4HAS7'
);

export const marketsCacheKey = 'markets';

export const marketsMemo = new MemoizedCache<Market[]>(marketsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

export const marketsApiUrl = 'https://web-api.exponent.finance/api/markets';

export const ptTokensApiUrl = 'https://web-api.exponent.finance/api/tokens/pt';
