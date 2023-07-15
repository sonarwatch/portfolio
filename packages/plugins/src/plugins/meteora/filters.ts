import { GetProgramAccountsFilter } from '@solana/web3.js';
import { vaultStruct } from './struct';

export const aquafarmFilters: GetProgramAccountsFilter[] = [
  { dataSize: vaultStruct.byteSize },
];
