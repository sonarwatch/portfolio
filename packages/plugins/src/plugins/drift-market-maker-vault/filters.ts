import { GetProgramAccountsFilter } from '@solana/web3.js';
import { vaultDepositorStruct } from './structs';

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
  {
    memcmp: {
      offset: 0,
      bytes: 'cJJWPqNMczr',
    },
  },
];
