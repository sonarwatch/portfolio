import { GetProgramAccountsFilter } from '@solana/web3.js';
import { dcaStruct } from './structs';

export const limitFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 0,
      bytes: 'PXZJQQ2HEmx',
    },
  },
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
];

export const DCAFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
  { dataSize: dcaStruct.byteSize },
];

export const valueAverageFilters = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 18,
      bytes: owner,
    },
  },
  { dataSize: 339 },
];
