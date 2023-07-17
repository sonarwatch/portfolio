import { GetProgramAccountsFilter } from '@solana/web3.js';
import { vaultStruct } from './struct';

export const vaultsFilters: GetProgramAccountsFilter[] = [
  { dataSize: vaultStruct.byteSize },
];
