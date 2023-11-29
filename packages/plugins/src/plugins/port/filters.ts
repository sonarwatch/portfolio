import { GetProgramAccountsFilter } from '@solana/web3.js';
import { obligationStruct } from './structs';

export const obligationsFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 42,
      bytes: owner,
    },
  },
  { dataSize: obligationStruct.byteSize },
];
