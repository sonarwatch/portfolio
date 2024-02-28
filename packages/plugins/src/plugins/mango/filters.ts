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

export const boostAccountsFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 0,
      bytes: 'ho5hwwEoHot',
    },
  },
  {
    memcmp: {
      offset: 8,
      bytes: 'AKeMSYiJekyKfwCc3CUfVNDVAiqk9FfbQVMY3G7RUZUf',
    },
  },
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
];

export const boostBanksFilters: GetProgramAccountsFilter[] = [
  {
    memcmp: {
      offset: 0,
      bytes: 'QnTef4UXSzF',
    },
  },
  { dataSize: 3072 },
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

export const groupFilter: GetProgramAccountsFilter[] = [
  {
    dataSize: 6032,
  },
];

export const rootBankFilter: GetProgramAccountsFilter[] = [
  {
    dataSize: 424,
  },
];

export const redeemFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: '98pjRuQjK3qA6gXts96PqZT4Ze5QmnCmt3QYjhbUSPue',
    },
  },
  {
    dataSize: 4296,
  },
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
];
