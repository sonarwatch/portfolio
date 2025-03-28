import { PublicKey } from '@solana/web3.js';
import { NetworkId, Platform } from '@sonarwatch/portfolio-core';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { BankInfo } from './types';
import { arrayToMap } from '../../utils/misc/arrayToMap';

export const platformId = 'marginfi';
export const platform: Platform = {
  id: platformId,
  name: 'Marginfi',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/marginfi.webp',
  defiLlamaId: 'parent#marginfi',
  website: 'https://www.marginfi.com/',
  github: 'https://github.com/mrgnlabs/',
  documentation: 'https://docs.marginfi.com/',
  twitter: 'https://twitter.com/marginfi',
  telegram: 'https://t.me/mrgnteam',
  tokens: ['LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp'],
  description:
    'A liquidity layer built for finance. Access native yield, embedded risk systems, and off-chain data plug-ins.',
};
export const marginfiProgramId = new PublicKey(
  'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'
);

export const MarginfiAccountAddress =
  '4qp6Fx6tnZkY5Wropq9wUYgtFxXKwE6viZxFHg3rdAG8';

export const banksKey = 'banks';

export const marginFiBanksMemo = new MemoizedCache<
  ParsedAccount<BankInfo>[],
  Map<string, ParsedAccount<BankInfo>>
>(
  banksKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pubkey')
);
