import { GetProgramAccountsFilter } from '@solana/web3.js';
import { vaultDepositorStruct, vaultStruct } from './structs';

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

export const vaultFilter: GetProgramAccountsFilter[] = [
  { dataSize: vaultStruct.byteSize },
];
