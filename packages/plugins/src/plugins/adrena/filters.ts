import { GetProgramAccountsFilter } from '@solana/web3.js';

export const positionFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 16,
      bytes: owner,
    },
  },
  {
    dataSize: 288,
  },
];

export const custodiesFilters: GetProgramAccountsFilter[] = [
  {
    dataSize: 824,
  },
];
