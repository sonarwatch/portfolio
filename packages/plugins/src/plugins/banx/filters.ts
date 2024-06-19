import { GetProgramAccountsFilter } from '@solana/web3.js';
import { bondTradeTransactionV3DataSize } from './constants';

export const stakeFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 9,
      bytes: owner,
    },
  },
  { dataSize: 160 },
];

export const loanFiltersA = (owner: string): GetProgramAccountsFilter[] => [
  {
    dataSize: bondTradeTransactionV3DataSize,
  },
  {
    memcmp: {
      bytes: owner,
      offset: 41,
    },
  },
];

export const loanFiltersB = (owner: string): GetProgramAccountsFilter[] => [
  {
    dataSize: bondTradeTransactionV3DataSize,
  },
  {
    memcmp: {
      bytes: owner,
      offset: 147,
    },
  },
];
