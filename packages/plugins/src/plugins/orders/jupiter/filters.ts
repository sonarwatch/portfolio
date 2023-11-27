import { GetProgramAccountsFilter } from '@solana/web3.js';
import { dcaStruct } from './struct';

export const jupiterLimitsFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 0,
      bytes: 'PXZJQQ2HEmx',
    },
  },
  {
    memcmp: {
      offset: 104,
      bytes: '2',
    },
  },
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
];

export const jupiterDCAFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
  { dataSize: dcaStruct.byteSize },
];
