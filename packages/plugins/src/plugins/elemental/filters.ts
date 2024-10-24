import { GetProgramAccountsFilter } from '@solana/web3.js';

export const positionFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
  {
    dataSize: 128,
  },
];

export const poolFilter: GetProgramAccountsFilter[] = [
  {
    dataSize: 254,
  },
];
