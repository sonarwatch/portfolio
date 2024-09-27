import { GetProgramAccountsFilter } from '@solana/web3.js';

export const escrowFilters = (
  organization_identifier: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: organization_identifier,
    },
  },
  { dataSize: 208 },
];

export const orderFilters = (
  organization_identifier: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 73,
      bytes: organization_identifier,
    },
  },
  { dataSize: 355 },
];

export const loanVaultFilters = (
  borrower: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8 + 32 + 32,
      bytes: borrower,
    },
  },
  { dataSize: 338 },
];
