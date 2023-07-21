import { GetProgramAccountsFilter } from '@solana/web3.js';

export const accountsFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 0,
      bytes: 'ho5hwwEoHot',
    },
  },
  {
    memcmp: {
      offset: 8,
      bytes: '78b8f4cGCwmZ9ysPFMWLaLTkkaYnUjwMJYStWe5RTSSX',
    },
  },
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
];

export const banksFilter: GetProgramAccountsFilter[] = [
  {
    memcmp: {
      offset: 0,
      bytes: 'QnTef4UXSzF',
    },
  },
  {
    memcmp: {
      bytes: '78b8f4cGCwmZ9ysPFMWLaLTkkaYnUjwMJYStWe5RTSSX',
      offset: 8,
    },
  },
];
