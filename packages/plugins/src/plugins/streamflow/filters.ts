import { GetProgramAccountsFilter } from '@solana/web3.js';

export const vestingAccountFilters = (
  address: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 49,
      bytes: address.toString(),
    },
  },
];
export const withdrawalVestingAccountFilters = (
  address: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 113,
      bytes: address.toString(),
    },
  },
];
