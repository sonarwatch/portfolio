import { GetProgramAccountsFilter } from '@solana/web3.js';

export const vaultsFilters: GetProgramAccountsFilter[] = [{ dataSize: 10240 }];

export const constantPoolsFilters: GetProgramAccountsFilter[] = [
  { dataSize: 944 },
];

export const stablePoolsFilters: GetProgramAccountsFilter[] = [
  { dataSize: 1387 },
];

export const farmAccountFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  { dataSize: 200 },
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
];
