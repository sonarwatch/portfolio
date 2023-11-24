import { GetProgramAccountsFilter } from '@solana/web3.js';
import { liquidityStruct } from './structs';

export const liquidityAccountFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 72,
      bytes: owner,
    },
  },
  { dataSize: liquidityStruct.byteSize },
];
