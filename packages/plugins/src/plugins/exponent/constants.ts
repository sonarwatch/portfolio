import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Market } from './types';

export const platformId = 'exponent';
export const platform: Platform = {
  id: platformId,
  name: 'Exponent',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/exponent.webp',
  website: 'https://www.exponent.finance',
  twitter: 'https://x.com/exponentfinance',
  documentation: 'https://docs.exponent.finance/',
  telegram: 'https://t.me/exponentcitizens',
  github: 'https://github.com/exponent-finance',
  description:
    'Building Solana’s DeFi yield exchange — Choose between fixed or leveraged yields.',
  defiLlamaId: 'exponent',
};

export const exponentCoreProgram = new PublicKey(
  'ExponentnaRg3CQbW6dqQNZKXp7gtZ9DGMp1cwC4HAS7'
);

export const marketsCacheKey = 'markets';

export const marketsMemo = new MemoizedCache<Market[]>(marketsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

export const marketsApiUrl =
  'https://xpon-json-api-prod-650968662509.europe-west3.run.app/api/markets';

export const ptTokensApiUrl =
  'https://xpon-json-api-prod-650968662509.europe-west3.run.app/api/tokens/pt';
