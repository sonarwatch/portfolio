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

export const vestingFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
  { dataSize: 269 },
];
