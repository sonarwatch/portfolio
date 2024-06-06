import { GetProgramAccountsFilter } from '@solana/web3.js';
import { userStateStruct } from './structs/vaults';

export const userStateFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 48,
      bytes: owner,
    },
  },
  {
    dataSize: userStateStruct.byteSize,
  },
];
