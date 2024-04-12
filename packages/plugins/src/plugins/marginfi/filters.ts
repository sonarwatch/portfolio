import { GetProgramAccountsFilter } from '@solana/web3.js';
import { MarginfiAccountAddress } from './constants';
import { bankStruct } from './structs/Bank';

export const accountsFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      bytes: 'CKkRR4La3xu',
      offset: 0,
    },
  },
  {
    memcmp: {
      bytes: MarginfiAccountAddress,
      offset: 8,
    },
  },
  {
    memcmp: {
      bytes: owner,
      offset: 40,
    },
  },
];

export const banksFilters = (): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      bytes: 'QnTef4UXSzF',
      offset: 0,
    },
  },
  {
    memcmp: {
      bytes: MarginfiAccountAddress,
      offset: 41,
    },
  },
  {
    dataSize: bankStruct.byteSize,
  },
];
