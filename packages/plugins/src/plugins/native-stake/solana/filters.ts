import { GetProgramAccountsFilter } from '@solana/web3.js';

export const stakeAccountsFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 44,
      bytes: owner,
    },
  },
  {
    dataSize: 200,
  },
];
