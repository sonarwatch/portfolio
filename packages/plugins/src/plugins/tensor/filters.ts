import { GetProgramAccountsFilter } from '@solana/web3.js';
import { singleListingStruct } from './struct';

export const singleListingFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  { dataSize: singleListingStruct.byteSize },
  {
    memcmp: {
      bytes: owner,
      offset: 8,
    },
  },
];

export const poolFilter = (owner: string): GetProgramAccountsFilter[] => [
  { dataSize: 293 },
  {
    memcmp: {
      bytes: owner,
      offset: 71,
    },
  },
];

export const locksFilter = (owner: string): GetProgramAccountsFilter[] => [
  { dataSize: 472 },
  {
    memcmp: {
      bytes: owner,
      offset: 47,
    },
  },
];
