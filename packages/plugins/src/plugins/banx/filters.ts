import { GetProgramAccountsFilter } from '@solana/web3.js';

export const stakeFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 9,
      bytes: owner,
    },
  },
  { dataSize: 160 },
];
