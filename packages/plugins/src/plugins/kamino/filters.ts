import { GetProgramAccountsFilter } from '@solana/web3.js';
import { obligationStruct } from './structs/klend';

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
