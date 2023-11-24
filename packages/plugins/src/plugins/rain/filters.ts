import { GetProgramAccountsFilter } from '@solana/web3.js';
import { poolStruct } from './structs/pool';

export const poolFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 9,
      bytes: owner,
    },
  },
  {
    dataSize: poolStruct.byteSize,
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
    dataSize: poolStruct.byteSize,
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
    dataSize: poolStruct.byteSize,
  },
];
