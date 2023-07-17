import { GetProgramAccountsFilter } from '@solana/web3.js';
import { vaultStruct } from './struct';

export const vaultsFilters: GetProgramAccountsFilter[] = [
  { dataSize: vaultStruct.byteSize },
];

export const constantPoolsFilters: GetProgramAccountsFilter[] = [
  { dataSize: 944 },
];

export const stablePoolsFilters: GetProgramAccountsFilter[] = [
  { dataSize: 1387 },
];
