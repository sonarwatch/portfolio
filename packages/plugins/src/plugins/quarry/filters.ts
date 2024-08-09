import { GetProgramAccountsFilter } from '@solana/web3.js';

export const minerFilters = (authority: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 40,
      bytes: authority,
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
