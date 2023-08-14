import { GetProgramAccountsFilter } from '@solana/web3.js';

export const serumOrderFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 45,
      bytes: owner,
    },
  },
  {
    dataSize: 3228,
  },
];
