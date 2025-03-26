import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { BankInfo } from './types';
import { arrayToMap } from '../../utils/misc/arrayToMap';

export const platformId = 'marginfi';
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
