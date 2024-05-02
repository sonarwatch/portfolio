import { GetProgramAccountsFilter } from '@solana/web3.js';

export const userAccountFilters = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 41,
      bytes: owner,
    },
  },
  {
    dataSize: 416,
  },
];

export const marketAccountFilters: GetProgramAccountsFilter[] = [
  {
    dataSize: 1104,
  },
];
