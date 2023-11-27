import { GetProgramAccountsFilter } from '@solana/web3.js';
import { escrowStruct } from './structs';

export const escrowFilter = (owner: string): GetProgramAccountsFilter[] => [
  {
    memcmp: {
      offset: 40,
      bytes: owner,
    },
  },
  { dataSize: escrowStruct.byteSize },
];
