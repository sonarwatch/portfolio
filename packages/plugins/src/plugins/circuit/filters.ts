import { GetProgramAccountsFilter } from '@solana/web3.js';
import { vaultDepositorStruct, vaultStruct } from './structs';

export const vaultsFilter: GetProgramAccountsFilter[] = [
  { dataSize: vaultStruct.byteSize },
];

export const vaultDepositorFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  { dataSize: vaultDepositorStruct.byteSize },
  {
    memcmp: {
      offset: 72,
      bytes: owner,
    },
  },
];
