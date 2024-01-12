import { GetProgramAccountsFilter } from '@solana/web3.js';
import { lpAccountStruct } from './structs';

export const lpAccountFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 64,
      bytes: owner,
    },
  },
  {
    dataSize: lpAccountStruct.byteSize,
  },
];
