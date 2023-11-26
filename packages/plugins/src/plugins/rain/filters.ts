import { GetProgramAccountsFilter } from '@solana/web3.js';
import { loanStruct } from './structs/loan';

export const poolFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 9,
      bytes: owner,
    },
  },
  {
    dataSize: 1331,
  },
];

export const loanBorrowerFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 10,
      bytes: owner,
    },
  },
  {
    dataSize: loanStruct.byteSize,
  },
];

export const loanLenderFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 42,
      bytes: owner,
    },
  },
  {
    dataSize: loanStruct.byteSize,
  },
];
