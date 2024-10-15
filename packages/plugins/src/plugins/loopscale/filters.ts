import { GetProgramAccountsFilter } from '@solana/web3.js';

export const roleFilters = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
];

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

export const loanVaultLentFilters = (
  borrower: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 8 + 32,
      bytes: borrower,
    },
  },
  { dataSize: 338 },
];

export const loanVaultBorrowedFilters = (
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

export const lockboxFilters = (nft: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 52,
      bytes: nft,
    },
  },
];
