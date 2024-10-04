import { GetProgramAccountsFilter } from '@solana/web3.js';

export const stableFilter: GetProgramAccountsFilter[] = [
  {
    memcmp: {
      offset: 40,
      bytes: 'stab1io8dHvK26KoHmTwwHyYmHRbUWbyEJx6CdrGabC',
    },
  },
];

export const weightedFilter: GetProgramAccountsFilter[] = [
  {
    memcmp: {
      offset: 40,
      bytes: 'w8edo9a9TDw52c1rBmVbP6dNakaAuFiPjDd52ZJwwVi',
    },
  },
];
