import { GetProgramAccountsFilter } from '@solana/web3.js';
import { claimStatusStruct } from '../jito/structs';

export const claimFilters = (owner: string): GetProgramAccountsFilter[] => [
  { dataSize: claimStatusStruct.byteSize },
  {
    memcmp: {
      offset: 8,
      bytes: owner,
    },
  },
];
