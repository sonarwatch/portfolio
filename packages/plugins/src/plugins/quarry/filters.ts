import { GetProgramAccountsFilter } from '@solana/web3.js';

export const minerFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
  { dataSize: 145 },
];

export const mergeMinerFilters = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
  { dataSize: 97 },
];
