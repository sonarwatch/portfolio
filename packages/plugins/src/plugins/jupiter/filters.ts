import { GetProgramAccountsFilter } from '@solana/web3.js';

export const perpetualsPositionsFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
  { dataSize: 216 },
];
