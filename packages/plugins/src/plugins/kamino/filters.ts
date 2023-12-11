import { GetProgramAccountsFilter } from '@solana/web3.js';
import { obligationStruct } from './structs/klend';
import { userStateStruct } from './structs/vaults';

export const obligationsFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 224,
      bytes: owner,
    },
  },
  {
    dataSize: obligationStruct.byteSize,
  },
];

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
